import Order from "../models/order.js";
import Service from "../models/service.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const getCloudinaryResourceType = (file = {}) => {
  if (file.resourceType) return file.resourceType;
  if (file.resource_type) return file.resource_type;
  if ((file.mimeType || "").startsWith("image/")) return "image";
  if ((file.mimeType || "").startsWith("video/")) return "video";
  return "raw";
};

const getFileExtension = (value = "") => {
  const clean = value.split("?")[0];
  const lastDot = clean.lastIndexOf(".");
  return lastDot > -1 ? clean.slice(lastDot + 1) : "";
};

const buildCloudinaryUrl = (file = {}) => {
  if (!file.public_id) return file.url || "";

  const resourceType = getCloudinaryResourceType(file);

  if (resourceType === "raw") {
    const extensionFromPublicId = getFileExtension(file.public_id);
    const extensionFromName = getFileExtension(file.originalName);
    const format = extensionFromPublicId ? undefined : extensionFromName || undefined;

    return cloudinary.utils.private_download_url(file.public_id, format, {
      resource_type: "raw",
      type: "upload",
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    });
  }

  return cloudinary.url(file.public_id, {
    secure: true,
    resource_type: resourceType,
    type: "upload",
    version: file.version,
  });
};

const withAccessibleFileUrls = (order) => {
  const plainOrder = typeof order.toObject === "function" ? order.toObject() : order;

  return {
    ...plainOrder,
    file: (plainOrder.file || []).map((f) => ({
      ...f,
      url: buildCloudinaryUrl(f),
    })),
  };
};

const createOrder = async (req, res) => {
  try {
    const { serviceId, instructions, copies } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service type not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one file" });
    }

    const quantity = parseInt(copies);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid number of copies" });
    }

    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file, {
        folder: "orders",
      })
    );

    const uploadedResults = await Promise.all(uploadPromises);

    const fileData = uploadedResults.map((result, index) => {
      if (!result || !result.public_id) {
        console.error('Cloudinary upload failed for file:', req.files[index].originalname, 'Result:', result);
        throw new Error('File upload to Cloudinary failed and did not return identifiers.');
      }
      return {
        originalName: req.files[index].originalname,
        url: result.secure_url || buildCloudinaryUrl(result),
        public_id: result.public_id,
        resourceType: result.resource_type,
        version: result.version,
        mimeType: req.files[index].mimetype,
        size: req.files[index].size,
      };
    });

    const fileCount = req.files.length;
    const normalizedUnit = (service.unit || "fixed").toLowerCase();

    const newOrder = await Order.create({
      customer: req.user._id,
      serviceType: service.name,
      file: fileData,
      instructions,
      copies: quantity,
      fileCount,
      totalPages: 0,
      billingUnits: 0,
      unitPrice: service.price,
      pricingUnit: normalizedUnit,
      totalAmount: 0,
      priceFinalized: false,
      priceFinalizedAt: null,
    });

    res.status(201).json(withAccessibleFileUrls(newOrder));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders.map(withAccessibleFileUrls));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders.map(withAccessibleFileUrls));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(withAccessibleFileUrls(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderPricing = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { totalAmount } = req.body;
    const parsedTotalAmount = Number(totalAmount);

    if (!Number.isFinite(parsedTotalAmount) || parsedTotalAmount < 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        totalAmount: parsedTotalAmount,
        priceFinalized: true,
        priceFinalizedAt: new Date(),
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(withAccessibleFileUrls(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder, getMyOrders, getAllOrders, updateOrderStatus, updateOrderPricing };

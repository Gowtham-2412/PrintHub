import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContet';
import api from '../../services/AxiosSetup';
import { X, Plus, UploadCloud, FileText, CheckCircle, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const UserServices = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const serviceData = await api.get('/service');
        setServices(serviceData.data.services);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const activeService = services.find((s) => s._id === selectedId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-[#0F172A]">Welcome, {user?.name.split(' ')[0]}</h1>
        <p className="text-[#475569] mt-2 text-lg">Select a service to start printing.</p>
      </header>

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              layoutId={service._id}
              key={service._id}
              onClick={() => setSelectedId(service._id)}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl transition-shadow group"
              whileHover={{ y: -5 }}
            >
              <motion.div
                layoutId={`icon-${service._id}`}
                className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2563EB] mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors"
              >
                <FileText size={28} />
              </motion.div>
              <motion.h3 layoutId={`title-${service._id}`} className="text-xl font-bold text-[#0F172A]">
                {service.name}
              </motion.h3>
              <motion.p layoutId={`price-${service._id}`} className="text-[#475569] mt-1 font-medium">
                Starting at Rs {service.price}
              </motion.p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedId && activeService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                layoutId={selectedId}
                className="bg-[#F8FAFC] w-full max-w-2xl h-full max-h-[90vh] rounded-[40px] overflow-hidden pointer-events-auto flex flex-col shadow-2xl shadow-blue-900/20"
              >
                <div className="relative h-48 bg-white p-8 flex items-end">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X size={20} className="text-[#0F172A]" />
                  </button>

                  <div className="flex items-center gap-6">
                    <motion.div
                      layoutId={`icon-${selectedId}`}
                      className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#2563EB]"
                    >
                      <FileText size={40} />
                    </motion.div>
                    <div>
                      <motion.h3 layoutId={`title-${selectedId}`} className="text-3xl font-black text-[#0F172A]">
                        {activeService.name}
                      </motion.h3>
                      <motion.p layoutId={`price-${selectedId}`} className="text-[#2563EB] font-bold text-lg">
                        Rs {activeService.price} / {activeService.unit}
                      </motion.p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <ServiceForm
                    service={activeService}
                    onComplete={() => setSelectedId(null)}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceForm = ({ service, onComplete }) => {
  const { addToCart } = useContext(CartContext);
  const [files, setFiles] = useState([null]);
  const [instructions, setInstructions] = useState('');
  const [copies, setCopies] = useState(1);

  const getSelectedEntries = () => files.filter(Boolean).map((file) => ({ file }));

  const resetForm = () => {
    setFiles([null]);
    setInstructions('');
    setCopies(1);
  };

  const handleFileChange = (index, e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFiles((prev) => {
      const next = [...prev];
      next[index] = selectedFile;
      return next;
    });
  };

  const handleAddFileInput = () => {
    setFiles((prev) => [...prev, null]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      if (prev.length === 1) return [null];
      return prev.filter((_, fileIndex) => fileIndex !== index);
    });
  };

  const handleAddToCart = (addAnother = false) => {
    const selectedEntries = getSelectedEntries();
    if (selectedEntries.length === 0) return toast.error('Please select at least one file first');

    const item = {
      serviceId: service._id,
      serviceName: service.name,
      price: service.price,
      unit: service.unit,
      files: selectedEntries.map((entry) => entry.file),
      fileCount: selectedEntries.length,
      instructions,
      copies
    };

    addToCart(item);

    if (addAnother) {
      resetForm();
    } else {
      onComplete();
    }
  };

  const selectedEntries = getSelectedEntries();

  return (
    <div className="space-y-6">
      {files.map((file, index) => (
        <div
          key={`file-${index}`}
          className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
            file ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white hover:border-[#2563EB]'
          }`}
        >
          {file ? (
            <div className="text-green-700">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" />
              <p className="font-bold">{file.name}</p>
              <div className="mt-2 flex items-center justify-center gap-4">
                <label className="text-xs underline text-[#475569] cursor-pointer">
                  Change file
                  <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e)} />
                </label>
                {files.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-xs underline text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <UploadCloud className="w-10 h-10 mx-auto mb-2 text-[#2563EB]" />
              <p className="font-bold text-[#0F172A]">Upload Document {index + 1}</p>
              <p className="text-sm text-[#475569]">PDF, PNG, or JPG (Max 10MB)</p>
              <input type="file" className="hidden" onChange={(e) => handleFileChange(index, e)} />
            </label>
          )}
        </div>
      ))}

      {files.some(Boolean) && (
        <button
          type="button"
          onClick={handleAddFileInput}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Plus size={16} /> Add one more file
        </button>
      )}

      {selectedEntries.length > 0 && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
          <p className="font-bold text-[#0F172A]">Pricing</p>
          <p className="mt-1">Final payable amount will be updated by admin after checking your uploaded file(s).</p>
          <p className="mt-1 font-semibold text-[#1E40AF]">Service rate: Rs {service.price} / {service.unit}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[#475569] mb-2">Copies</label>
          <input
            type="number"
            min="1"
            value={copies}
            onChange={(e) => setCopies(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#475569] mb-2">Instructions</label>
          <input
            type="text"
            placeholder="e.g. Color, A4"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => handleAddToCart(true)}
          className="flex-1 bg-slate-100 text-[#0F172A] py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          <Plus size={20} /> Add Another
        </button>

        <button
          onClick={() => handleAddToCart(false)}
          className="flex-[2] bg-[#2563EB] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-[#1E40AF] transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
        >
          <ShoppingCart size={20} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default UserServices;

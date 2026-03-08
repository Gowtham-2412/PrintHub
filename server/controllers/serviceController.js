import Service from "../models/service.js";

const createService = async (req, res) => {
    const { name, description, price, unit, icon, isActive } = req.body;

    try {
        const service = await Service.create({
            name,
            description,
            price,
            unit,
            icon,
            isActive
        })
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ "message": error.message });
    }
}

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({isActive : true});
        if(services) {
            res.json({services});
        } else {
            res.status(404).json({ "message" : "No services Found" })
        }
    } catch (error) {
        res.status(500).json({ "message" : error.message })
    }
}

const updateService = async (req, res) => {
    try {
        const { name, description, price, unit, isActive } = req.body;
        
        const service = await Service.findById(req.params.id);

        if(service) {
            service.name = name || service.name
            service.description = description || service.description
            service.price = price || service.price
            service.unit = unit || service.unit
            service.isActive = isActive !== undefined ? isActive : service.isActive

            const updatedService = await service.save();
            res.json(updatedService)
        } else {
            res.status(404).json({ 'message':'Service Not Found' })
        }

    } catch (error) {
        res.status(500).json({ 'message':error.message })
    }
}
const deleteService = async (req, res) => {
    try {
        const {id} = req.params
        await Service.findByIdAndDelete(id)

        res.status(200).json({ msg: "Service deleted successfully" });
    } catch (error) {
        console.error(error.message)
    }
}

export { createService, updateService, getAllServices, deleteService }
import {
    addVehicle,
    getAllVehicles,
    searchVehiclesQuery,
    updateVehicleDetails,
    deleteVehicleById,
    purchaseVehicleById,
    restockVehicleById
} from '../services/vehicleService.js';

const getErrorStatusAndMessage = (error) => {
    if (error.message === 'Vehicle not found') {
        return { status: 404, message: error.message };
    }
    if (error.message === 'Vehicle out of stock' || error.message === 'Invalid restock amount') {
        return { status: 400, message: error.message };
    }
    return { status: 400, message: error.message };
};

export const createVehicle = async (req, res) => {
    try {
        const vehicle = await addVehicle(req.body);
        res.status(201).json({ message: 'Vehicle added successfully', vehicle });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

export const getVehicles = async (req, res) => {
    try {
        const vehicles = await getAllVehicles();
        res.status(200).json({ vehicles });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

export const searchVehicles = async (req, res) => {
    try {
        const vehicles = await searchVehiclesQuery(req.query);
        res.status(200).json({ vehicles });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await updateVehicleDetails(req.params.id, req.body);
        res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await deleteVehicleById(req.params.id);
        res.status(200).json({ message: 'Vehicle deleted successfully', vehicle });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

export const purchaseVehicle = async (req, res) => {
    try {
        const vehicle = await purchaseVehicleById(req.params.id);
        res.status(200).json({ message: 'Vehicle purchased successfully', vehicle });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

export const restockVehicle = async (req, res) => {
    try {
        const { quantity } = req.body;
        const vehicle = await restockVehicleById(req.params.id, quantity);
        res.status(200).json({ message: 'Vehicle restocked successfully', vehicle });
    } catch (error) {
        const { status, message } = getErrorStatusAndMessage(error);
        res.status(status).json({ message });
    }
};

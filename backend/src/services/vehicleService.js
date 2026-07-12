import Vehicle from '../models/Vehicle.js';

export const addVehicle = async (vehicleData) => {
    const { make, model, category, price, quantity } = vehicleData;
    return await Vehicle.create({ make, model, category, price, quantity });
};

export const getAllVehicles = async () => {
    return await Vehicle.find({});
};

export const searchVehiclesQuery = async (queryParameters) => {
    const { make, model, category, minPrice, maxPrice, search } = queryParameters;
    const query = {};

    if (search) {
        query.$or = [
            { make: { $regex: search, $options: 'i' } },
            { model: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ];
    } else {
        if (make) query.make = { $regex: make, $options: 'i' };
        if (model) query.model = { $regex: model, $options: 'i' };
    }

    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
        if (Object.keys(query.price).length === 0) delete query.price;
    }

    return await Vehicle.find(query);
};

export const updateVehicleDetails = async (id, updateData) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    const fields = ['make', 'model', 'category', 'price', 'quantity'];
    fields.forEach(field => {
        if (updateData[field] !== undefined) {
            vehicle[field] = updateData[field];
        }
    });

    return await vehicle.save();
};

export const deleteVehicleById = async (id) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');
    await vehicle.deleteOne();
    return vehicle;
};

export const purchaseVehicleById = async (id) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    if (vehicle.quantity <= 0) {
        throw new Error('Vehicle out of stock');
    }

    vehicle.quantity -= 1;
    return await vehicle.save();
};

export const restockVehicleById = async (id, amount) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');

    const restockAmount = Number(amount);
    if (isNaN(restockAmount) || restockAmount <= 0) {
        throw new Error('Invalid restock amount');
    }

    vehicle.quantity += restockAmount;
    return await vehicle.save();
};

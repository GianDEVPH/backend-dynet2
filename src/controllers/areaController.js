// Manages geographical area operations including creating, updating, and retrieving area data within cities for organizational structure.

const Area = require('../models/areaModel');
const City = require('../models/cityModel')
exports.addArea = async (req, res) => {
    try {
        const { name } = req.body;
        const cityId = req.params.cityId;
        const newArea = new Area({ name, city: cityId, districts: [] });
        await newArea.save();
        const city = await City.findById(cityId);
        city.areas.push(newArea._id);
        await city.save();
        res.status(201).json(newArea);
    } catch (error) {
        console.error('Failed to add area:', error);
        res.status(500).json({ message: 'Failed to add area' });
    }
};
exports.getAreas = async (req, res) => {
    try {
        const areas = await Area.find().populate('districts');
        res.json(areas);
    } catch (error) {
        console.error('Failed to fetch areas:', error);
        res.status(500).json({ message: 'Failed to fetch areas' });
    }
};
exports.getAreasByCity = async (req, res) => {
    try {
        const { cityId } = req.params;
        const areas = await Area.find({ city: cityId }).populate('districts');
        res.json(areas);
    } catch (error) {
        console.error('Failed to fetch areas by city ID:', error);
        res.status(500).json({ message: 'Failed to fetch areas by city ID' });
    }
};
exports.deleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedArea = await Area.findById(id);
        await Area.findByIdAndDelete(id);
        await City.findByIdAndUpdate(deletedArea.city, { $pull: { areas: id } });
        res.json({ message: 'Area deleted successfully' });
    } catch (error) {
        console.error('Failed to delete area:', error);
        res.status(500).json({ message: 'Failed to delete area' });
    }
};

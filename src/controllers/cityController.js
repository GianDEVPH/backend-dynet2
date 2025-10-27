// Handles city management operations including creating, updating, deleting, and retrieving city data for geographical organization.

const City = require('../models/cityModel');
exports.addCity = async (req, res) => {
  try {
    const { name } = req.body;
    const newCity = new City({ name, areas: [] }); 
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    console.error('Failed to add city:', error);
    res.status(500).json({ message: 'Failed to add city' });
  }
};
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find().populate('areas');
    res.json(cities);
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
};
exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id).populate('areas');
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(city);
  } catch (error) {
    console.error('Failed to fetch city by ID:', error);
    res.status(500).json({ message: 'Failed to fetch city' });
  }
};
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    await City.findByIdAndDelete(id);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Failed to delete city:', error);
    res.status(500).json({ message: 'Failed to delete city' });
  }
};

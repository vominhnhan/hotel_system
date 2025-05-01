const serviceService = require('../services/serviceService');
const { ERROR_MESSAGES } = require('../common/constants');

const createService = async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await serviceService.deleteService(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
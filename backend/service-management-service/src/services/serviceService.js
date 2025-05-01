const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ERROR_MESSAGES } = require('../common/constants');

const checkServiceExists = async (id) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    throw new Error(ERROR_MESSAGES.SERVICE_NOT_FOUND);
  }
  return service;
};

const createService = async (data) => {
  return await prisma.service.create({
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
    },
  });
};

const getServiceById = async (id) => {
  await checkServiceExists(id);
  return await prisma.service.findUnique({ where: { id } });
};

const getAllServices = async () => {
  return await prisma.service.findMany({
    orderBy: { created_at: 'desc' },
  });
};

const updateService = async (id, data) => {
  await checkServiceExists(id);
  return await prisma.service.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
    },
  });
};

const deleteService = async (id) => {
  await checkServiceExists(id);
  return await prisma.service.delete({ where: { id } });
};

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
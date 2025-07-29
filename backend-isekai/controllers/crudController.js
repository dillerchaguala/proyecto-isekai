// backend-isekai/controllers/crudController.js
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Mapear nombre de recurso a modelo
const models = {
  logros: require('../models/Logro'),
  terapias: require('../models/Terapia'),
  actividades: require('../models/Actividad'),
  desafios: require('../models/Desafio'),
};

// Obtener modelo por recurso
function getModel(resource) {
  const model = models[resource];
  if (!model) throw new AppError('Recurso no soportado', 400);
  return model;
}

exports.create = catchAsync(async (req, res, next) => {
  const Model = getModel(req.params.resource);
  const doc = await Model.create(req.body);
  res.status(201).json({ status: 'success', data: { [req.params.resource]: doc } });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const Model = getModel(req.params.resource);
  const docs = await Model.find();
  // Responde como objeto con la clave del recurso para compatibilidad con el frontend
  res.status(200).json({ status: 'success', results: docs.length, data: { [req.params.resource]: docs } });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const Model = getModel(req.params.resource);
  const doc = await Model.findById(req.params.id);
  if (!doc) return next(new AppError('No encontrado', 404));
  res.status(200).json({ status: 'success', data: { [req.params.resource]: doc } });
});

exports.update = catchAsync(async (req, res, next) => {
  const Model = getModel(req.params.resource);
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) return next(new AppError('No encontrado', 404));
  res.status(200).json({ status: 'success', data: { [req.params.resource]: doc } });
});

exports.delete = catchAsync(async (req, res, next) => {
  const Model = getModel(req.params.resource);
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) return next(new AppError('No encontrado', 404));
  res.status(204).json({ status: 'success', data: null });
});

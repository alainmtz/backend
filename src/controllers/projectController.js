const { Project, ProjectItem, Item, Consumible, ProjectConsumible } = require('../models');
const { ValidationError, NotFoundError, InternalError } = require('../utils/errors');

// Obtener todos los proyectos (con items y consumibles)
exports.getAll = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: ProjectItem,
          as: 'projectItems',
          include: { model: Item, as: 'item' }
        },
        {
          model: ProjectConsumible,
          as: 'projectConsumibles',
          include: { model: Consumible, as: 'consumible' }
        }
      ]
    });
    res.json(projects);
  } catch (err) {
    next(new InternalError('Error al obtener proyectos', err));
  }
};

const { body, validationResult } = require('express-validator');

exports.validateCreate = [
  body('name').isString().notEmpty().withMessage('El nombre es obligatorio'),
  body('description').optional().isString(),
  body('labor_cost').optional().isFloat({ min: 0 }),
  body('items').optional().isArray(),
  body('consumibles').optional().isArray(),
];

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Datos inválidos para crear proyecto', errors.array()));
  }
  try {
    const { name, description, items, consumibles } = req.body;
    const { labor_cost } = req.body;
    const project = await Project.create({ name, description, labor_cost });
    // Items
    if (items && Array.isArray(items)) {
      for (const i of items) {
        const item = await Item.findByPk(i.item_id);
        if (item) {
          await ProjectItem.create({
            project_id: project.id,
            item_id: i.item_id,
            quantity: i.quantity,
            unit_price: item.price
          });
        }
      }
    }
    // Consumibles
    if (consumibles && Array.isArray(consumibles)) {
      for (const c of consumibles) {
        const consumible = await Consumible.findByPk(c.consumible_id);
        if (consumible) {
          await ProjectConsumible.create({
            project_id: project.id,
            consumible_id: c.consumible_id,
            quantity_used: c.quantity_used,
            unit_cost: consumible.cost_price
          });
        }
      }
    }
    res.status(201).json(project);
  } catch (err) {
    next(new ValidationError('Error al crear proyecto', err));
  }
};

// Obtener proyecto por ID con items, consumibles y costo total
exports.getById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: ProjectItem,
          as: 'projectItems',
          include: { model: Item, as: 'item' }
        },
        {
          model: ProjectConsumible,
          as: 'projectConsumibles',
          include: { model: Consumible, as: 'consumible' }
        }
      ]
    });
    if (!project) throw new NotFoundError('Proyecto no encontrado');
    // Calcular costo total
    const totalItems = project.projectItems.reduce((sum, pi) => sum + (pi.unit_price * pi.quantity), 0);
    const totalConsumibles = project.projectConsumibles.reduce((sum, pc) => {
      const consumible = pc.consumible;
      if (consumible && consumible.usage_count > 0) {
        return sum + ((consumible.sale_price / consumible.usage_count) * pc.quantity_used);
      }
      return sum;
    }, 0);
    res.json({
      ...project.toJSON(),
      total_cost: totalItems + totalConsumibles + (project.labor_cost || 0),
      labor_cost: project.labor_cost
    });
  } catch (err) {
    if (err instanceof NotFoundError) return next(err);
    next(new InternalError('Error al obtener proyecto', err));
  }
};

// Actualizar proyecto
exports.update = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw new NotFoundError('Proyecto no encontrado');
    await project.update({ ...req.body, labor_cost: req.body.labor_cost });
    res.json(project);
  } catch (err) {
    if (err instanceof NotFoundError) return next(err);
    next(new ValidationError('Error al actualizar proyecto', err));
  }
};

// Eliminar proyecto
exports.remove = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw new NotFoundError('Proyecto no encontrado');
    await ProjectItem.destroy({ where: { project_id: project.id } });
    await project.destroy();
    res.json({ success: true });
  } catch (err) {
    if (err instanceof NotFoundError) return next(err);
    next(new InternalError('Error al eliminar proyecto', err));
  }
};

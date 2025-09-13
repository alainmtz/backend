const { Project, ProjectItem, Item, Consumible, ProjectConsumible } = require('../models');

// Obtener todos los proyectos (con items y consumibles)
exports.getAll = async (req, res) => {
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
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

// Crear proyecto con items y consumibles
exports.create = async (req, res) => {
  try {
    const { name, description, items, consumibles } = req.body;
    const { labor_cost } = req.body; // Extract labor_cost from request body
    const project = await Project.create({ name, description, labor_cost }); // Include labor_cost in project creation
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
    res.status(400).json({ error: 'Error al crear proyecto', details: err });
  }
};

// Obtener proyecto por ID con items, consumibles y costo total
exports.getById = async (req, res) => {
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
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
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
      total_cost: totalItems + totalConsumibles + (project.labor_cost || 0), // Include labor_cost in total cost
      labor_cost: project.labor_cost // Return labor_cost in response
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
};

// Actualizar proyecto
exports.update = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
  await project.update({ ...req.body, labor_cost: req.body.labor_cost }); // Ensure labor_cost is updated
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar proyecto', details: err });
  }
};

// Eliminar proyecto
exports.remove = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    await ProjectItem.destroy({ where: { project_id: project.id } });
    await project.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};

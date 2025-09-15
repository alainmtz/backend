const { User } = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = {
  // Registrar usuario
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, first_name, last_name } = req.body;
    try {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ error: 'El usuario ya existe' });
      const password_hash = await bcrypt.hash(password, 10);
      // Asignar rol 'User' (id 5) por defecto
      const role = 'User';
      const user = await User.create({ email, password_hash, first_name, last_name, role });
      // Asignar el rol en UserRoles con id 5
      const UserRoleModel = require('../models').UserRole;
      await UserRoleModel.create({ user_id: user.id, role_id: 5 });
      res.status(201).json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role });
    } catch (err) {
      res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
    }
  },

  // Obtener todos los usuarios
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, email, role } = req.query;
      const where = {};
      if (email) where.email = email;
      if (role) where.role = role;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { rows, count } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password_hash'] },
        offset,
        limit: parseInt(limit)
      });
      res.json({ total: count, page: parseInt(page), limit: parseInt(limit), users: rows });
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
    }
  },

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password_hash'] } });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener usuario', details: err.message });
    }
  },

  // Actualizar usuario
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      const { first_name, last_name, email, role } = req.body;
      await user.update({ first_name, last_name, email, role });
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar usuario', details: err.message });
    }
  },

  // Eliminar usuario
  async remove(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      await user.destroy();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar usuario', details: err.message });
    }
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { name: 'admin', description: 'Administrador' },
      { name: 'staff', description: 'Personal' },
      { name: 'developer', description: 'Desarrollador' },
      { name: 'vendedor', description: 'Vendedor' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

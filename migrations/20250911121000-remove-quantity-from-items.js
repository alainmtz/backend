
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Verificar si la columna existe antes de eliminar
    const table = await queryInterface.describeTable('Items');
    if (table.quantity) {
      await queryInterface.removeColumn('Items', 'quantity');
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'quantity', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  }
};

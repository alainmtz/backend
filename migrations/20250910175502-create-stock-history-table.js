'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('stock_history', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        item_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Items',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        stock_level: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sales: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('stock_history');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('Suppliers', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        contact_person: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        items_supplied: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Suppliers');
  }
};

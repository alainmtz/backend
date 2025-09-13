'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('Items', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        sku: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        price: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: false,
        },
        cost: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
        },
        quantity: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        brand: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        model: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('in-stock','low-stock','out-of-stock','discontinued'),
          defaultValue: 'in-stock',
        },
        supplier_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Suppliers',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        provenance: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        warranty_days: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        image_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  }
};

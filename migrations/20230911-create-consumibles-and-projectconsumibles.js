"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Consumibles", {
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
      usage_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      cost_price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      sale_price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
    await queryInterface.createTable("ProjectConsumibles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      consumible_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Consumibles",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      quantity_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ProjectConsumibles");
    await queryInterface.dropTable("Consumibles");
  }
};

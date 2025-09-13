"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Projects", "labor_cost", {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Projects", "labor_cost");
  }
};

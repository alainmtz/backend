"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "phone", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Users", "phone");
  },
};

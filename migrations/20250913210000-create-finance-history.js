'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('FinanceHistory', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      finance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Finances',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      action: {
        type: Sequelize.ENUM('create', 'update', 'delete'),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL',
      },
      changes: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('FinanceHistory');
  }
};

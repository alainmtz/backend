'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.createTable('activity_log', {
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
          type: Sequelize.DATE,
          allowNull: false,
        },
        user: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        action: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        details: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      });
    },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('activity_log');
  }
};

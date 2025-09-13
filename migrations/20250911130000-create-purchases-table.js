'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Purchases', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      items: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      metodo_compra: {
        type: Sequelize.ENUM('tienda online','tienda fisica','proveedor local','proveedor extranjero','proveedor interno'),
        allowNull: false,
      },
      proveedor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      proveedor_nombre: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      costo_envio: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      },
      fecha_compra: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      notas: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Purchases');
  }
};

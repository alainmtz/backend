const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Purchase', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    metodo_compra: {
      type: DataTypes.ENUM('tienda online','tienda fisica','proveedor local','proveedor extranjero','proveedor interno'),
      allowNull: false,
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    proveedor_nombre: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    costo_envio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    fecha_compra: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'Purchases',
    timestamps: false,
    underscored: true,
  });
};

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(require('../src/config/config.js').development);

const Item = require('./models/item')(sequelize);
const Supplier = require('./models/supplier')(sequelize);
const User = require('./models/user')(sequelize);
const Transaction = require('./models/transaction')(sequelize);

// Relaciones
Item.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Transaction.belongsTo(Item, { foreignKey: 'item_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    // Crear un proveedor
    const supplier = await Supplier.create({
      name: 'Proveedor Test',
      contact_person: 'Juan Perez',
      email: 'proveedor@test.com',
      phone: '123456789',
      items_supplied: 'Varios'
    });

    // Crear un item relacionado con el proveedor
    const item = await Item.create({
      name: 'Producto Test',
      sku: 'SKU123',
      price: 100.00,
      supplier_id: supplier.id
    });

    // Crear un usuario
    const user = await User.create({
      first_name: 'Ana',
      last_name: 'Gomez',
      email: 'ana@test.com',
      password_hash: 'hash',
      role: 'staff'
    });

    // Crear una transacción relacionada con el item y el usuario
    const transaction = await Transaction.create({
      item_id: item.id,
      user_id: user.id,
      type: 'sale',
      quantity: 2,
      price: 200.00
    });

    // Consultar la transacción con sus relaciones
    const result = await Transaction.findOne({
      where: { id: transaction.id },
      include: [Item, User]
    });
    console.log('Transacción con relaciones:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
})();

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(require('../src/config/config.js').development);

const Item = require('./models/item')(sequelize);
const Supplier = require('./models/supplier')(sequelize);
const User = require('./models/user')(sequelize);
const Transaction = require('./models/transaction')(sequelize);
const ActivityLog = require('./models/activity_log')(sequelize);
const StockHistory = require('./models/stock_history')(sequelize);

// Relaciones
Item.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Item, { foreignKey: 'supplier_id' }); // Relación inversa
Transaction.belongsTo(Item, { foreignKey: 'item_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });
Item.hasMany(Transaction, { foreignKey: 'item_id' }); // Relación inversa
User.hasMany(Transaction, { foreignKey: 'user_id' }); // Relación inversa
ActivityLog.belongsTo(Item, { foreignKey: 'item_id' });
Item.hasMany(ActivityLog, { foreignKey: 'item_id' }); // Relación inversa
StockHistory.belongsTo(Item, { foreignKey: 'item_id' });
Item.hasMany(StockHistory, { foreignKey: 'item_id' }); // Relación inversa

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    // 1. Mostrar Items con su Supplier
    const items = await Item.findAll({ include: Supplier });
    console.log('Items con Supplier:', JSON.stringify(items, null, 2));

  // 1b. Mostrar Items con sus Transactions, ActivityLog y StockHistory
  const itemsFull = await Item.findAll({ include: [Transaction, ActivityLog, StockHistory] });
  console.log('Items con Transactions, ActivityLog y StockHistory:', JSON.stringify(itemsFull, null, 2));

    // 2. Mostrar Transactions con su Item y User
    const transactions = await Transaction.findAll({ include: [Item, User] });
    console.log('Transactions con Item y User:', JSON.stringify(transactions, null, 2));

  // 2b. Mostrar Users con sus Transactions
  const users = await User.findAll({ include: Transaction });
  console.log('Users con Transactions:', JSON.stringify(users, null, 2));

    // 3. Mostrar ActivityLog con su Item
    const activityLogs = await ActivityLog.findAll({ include: Item });
    console.log('ActivityLog con Item:', JSON.stringify(activityLogs, null, 2));

    // 4. Mostrar StockHistory con su Item
    const stockHistories = await StockHistory.findAll({ include: Item });
    console.log('StockHistory con Item:', JSON.stringify(stockHistories, null, 2));

    // 5. Mostrar Suppliers con sus Items (relación inversa)
    // Para que Sequelize reconozca la relación inversa, debes definir:
    // Supplier.hasMany(Item, { foreignKey: 'supplier_id' });
    // Esto permite hacer el include de Items en Supplier:
    const suppliers = await Supplier.findAll({
      include: Item
    });
    console.log('Suppliers con Items:', JSON.stringify(suppliers, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
})();

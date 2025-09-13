module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar tablas duplicadas o con nombres incorrectos
    await queryInterface.dropTable('activity_log', { force: true }).catch(() => {});
    await queryInterface.dropTable('Transaction', { force: true }).catch(() => {});
    await queryInterface.dropTable('suppliers', { force: true }).catch(() => {});
    // Renombrar tablas a plural y PascalCase si es necesario
    // Ejemplo: Si tienes tablas en singular, renómbralas a plural
    // await queryInterface.renameTable('User', 'Users');
    // await queryInterface.renameTable('Role', 'Roles');
    // await queryInterface.renameTable('Finance', 'Finances');
    // await queryInterface.renameTable('Purchase', 'Purchases');
    // await queryInterface.renameTable('Project', 'Projects');
    // await queryInterface.renameTable('Item', 'Items');
    // await queryInterface.renameTable('Consumible', 'Consumibles');
    // await queryInterface.renameTable('ProjectItem', 'ProjectItems');
    // await queryInterface.renameTable('ProjectConsumible', 'ProjectConsumibles');
    // await queryInterface.renameTable('Transaction', 'Transactions');
    // await queryInterface.renameTable('Supplier', 'Suppliers');
    // await queryInterface.renameTable('UserRole', 'UserRoles');
    // await queryInterface.renameTable('FinanceHistory', 'FinanceHistory');
    // await queryInterface.renameTable('Stock', 'Stock');
    // await queryInterface.renameTable('StockHistory', 'stock_history');
    // await queryInterface.renameTable('activity_logs', 'activity_logs');
    // NOTA: Si ya tienes las tablas en plural y bien nombradas, no es necesario renombrar.
    // Ajustar convenciones de nombres si es necesario
    // Puedes agregar más lógica aquí si detectas otras inconsistencias
  },
  down: async (queryInterface, Sequelize) => {
    // No se recomienda restaurar tablas eliminadas
  },
};
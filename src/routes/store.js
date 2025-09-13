/**
 * @swagger
 * /api/store/products:
 *   get:
 *     summary: Lista todos los productos disponibles en inventario
 *     tags:
 *       - Store
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { Item, Transaction, StockHistory, Supplier, Purchase } = require('../models');
const router = express.Router();

// Listar items disponibles
const { authenticateToken } = require('../middlewares/auth');
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [{ model: require('../models').Stock, as: 'stock' }]
    });
    // Mapear para devolver cantidad y estado desde Stock
    const products = items.map(item => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      quantity: item.stock ? item.stock.quantity : 0,
      status: item.stock ? item.stock.status : 'out-of-stock'
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener items' });
  }
});

// Procesar compra
router.post('/purchase', async (req, res) => {
  try {
    const { cart, cliente } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) return res.status(400).json({ error: 'Carrito vacío' });
    let total = 0;
  // Lógica de compra ahora solo usa Stock

      for (const cartItem of cart) {
        const item = await Item.findByPk(cartItem.id);
        if (!item || item.status === 'discontinued') return res.status(400).json({ error: `Item no disponible: ${cartItem.id}` });
        const stock = await require('../models').Stock.findOne({ where: { item_id: cartItem.id } });
        if (!stock) return res.status(400).json({ error: `Stock no encontrado para: ${item.name}` });
        if (stock.quantity < cartItem.quantity) return res.status(400).json({ error: `No hay suficiente inventario para: ${item.name}` });
        // Registrar transacción
        await Transaction.create({
          item_id: item.id,
          type: 'sale',
          quantity: cartItem.quantity,
          price: item.price,
          notes: `Venta a ${cliente.nombre || 'Cliente'} - Tel: ${cliente.telefono || ''}`,
          created_at: new Date()
        });
        // Rebajar inventario en Stock
        stock.quantity -= cartItem.quantity;
        if (stock.quantity === 0) stock.status = 'out-of-stock';
        else if (stock.quantity < 5) stock.status = 'low-stock';
        else stock.status = 'in-stock';
        await stock.save();
        // Registrar historial de stock
        await StockHistory.create({
          item_id: item.id,
          date: new Date(),
          stock_level: stock.quantity,
          sales: cartItem.quantity
        });
        total += item.price * cartItem.quantity;
      }
    doc.text(`Teléfono: ${cliente.telefono}`);
    doc.text(`Dirección: ${cliente.direccion}`);
    doc.text(`Identidad: ${cliente.identidad}`);
    doc.text(`Serie Artículo: ${cliente.serie}`);
    doc.text(`Garantía: ${cliente.garantia}`);
    doc.moveDown();
    doc.text('Artículos:', { underline: true });
    cart.forEach(p => {
      doc.text(`- ${p.name} (SKU: ${p.sku}) x${p.quantity} - $${p.price}`);
    });
    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`);
    doc.end();

    // Esperar a que el PDF se escriba
    doc.on('finish', () => {
      return res.json({ success: true, factura_url: `/uploads/${filename}` });
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error al procesar compra', details: err.message });
  }
});

// Registrar compra y actualizar stock
router.post('/purchases', async (req, res) => {
  try {
    const { items, metodo_compra, proveedor_id, proveedor_nombre, costo_envio, notas, fecha_compra } = req.body;
    let proveedorId = proveedor_id;
    // Si el proveedor es nuevo, crearlo
    if (!proveedorId && proveedor_nombre) {
      const proveedor = await Supplier.create({ name: proveedor_nombre });
      proveedorId = proveedor.id;
    }
    // Registrar la compra
    const compra = await Purchase.create({
      items,
      metodo_compra,
      proveedor_id: proveedorId,
      proveedor_nombre,
      costo_envio,
      notas,
      fecha_compra: fecha_compra || new Date()
    });
    // Actualizar stock y registrar historial
    for (const articulo of items) {
      const stock = await Stock.findOne({ where: { item_id: articulo.item_id } });
      if (!stock) continue;
      stock.quantity += articulo.cantidad;
      // Actualizar estado
      if (stock.quantity === 0) stock.status = 'out-of-stock';
      else if (stock.quantity < 5) stock.status = 'low-stock';
      else stock.status = 'in-stock';
      await stock.save();
      await StockHistory.create({
        item_id: articulo.item_id,
        date: new Date(),
        stock_level: stock.quantity,
        sales: 0 // Es una compra, no venta
      });
    }
    res.json({ success: true, compra });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar compra', details: err.message });
  }
});

// Consultar historial de compras
router.get('/purchases', async (req, res) => {
  try {
    const purchases = await require('../models').Purchase.findAll();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener compras', details: err.message });
  }
});

module.exports = router;
// ...existing code...

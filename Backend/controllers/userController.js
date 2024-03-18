// In userController.js

const Order = require('../models/Order');
const Book = require('../models/Books')
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller functions for order placement and management
exports.placeOrders = async (req, res) => {
  const { items, totalPrice } = req.body;
  const userId = req.user._id;
  try {
    const order = new Order({ user: userId, items, totalPrice });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.user._id;
  try {
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;
  try {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const Book = require('../models/Books');
const Order = require('../models/Order');
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
exports.addBook= async(req,res)=>{
     const {title,author,description,category,price,quantity}= req.body;
     try{
        const book= new Book({title,author,description,category,price,quantity});
        await book.save();

    res.json({message:'Book added successfully'});``
     } catch(error){
        res.status(500).json({error:'Internal Server Error '})
     }


}
exports.updateBook= async(req,res)=>{
    const {id}=req.params;
    const {title,author,description,category,price,quantity} = req.body;
    try{
        const book= await Book.findByIdAndUpdate(id,{title,author,description,category,price,quantity},{new:true});
        if(!book){
            return res.status(404).json({error:'Book not found'});
        }
    res.json({message:'Book updated successfully'});

    }catch(error){
        res.status(500).json({error:'Internal Server Error'});
    }
}
exports.deleteBook= async(req,res)=>{
    const {id}=req.params;
    try{
        const book=await Book.findByIdAndDelete(id);
        if(!book){
            return res.status(404).json({error:'Book not found'});
        }
        res.json({message:'Book deleted successfully'});

    }catch(error){
        res.status(500).json({error:'Internal Server Error'});
    }
}
// Controller functions for order management
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email'); // Populate user details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId).populate('user', 'email'); // Populate user details
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
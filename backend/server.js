const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const productsRoutes = require('./routes/products');
const userRoutes =require('./routes/user');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const uri = process.env.MONGO_URI;

app.use('/api/products', productsRoutes);
app.use('/api/user', userRoutes);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

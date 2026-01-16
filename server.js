const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db');

// --- Import Routes ---
const categoryRoutes = require('./src/routes/categoryRoutes');
const subCategoryRoutes = require('./src/routes/subCategoryRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Connecting to:', process.env.MONGO_URI);
connectDB();

app.use(express.json());

// --- Use Routes ---
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('Guestara Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

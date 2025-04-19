require('dotenv').config();
const express = require('express');
const cors = require('cors');
const  sequelize  = require('./config/sequelize')
const router = express.Router();

const userRoutes = require('./routes/userRoutes');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  

// Routes
app.use('/api/users', userRoutes);
app.use('/api/urls', urlRoutes);

// Sync Sequelize models 
sequelize.sync()
  .then(() => {
    console.log("Sequelize models are synchronized with the database.");
  })
  .catch((error) => {
    console.error("Error syncing Sequelize models:", error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

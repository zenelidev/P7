const express = require('express');
require('./models/index')
const router = require('./routes/index')

const path = require('path');

const app = express();
const cors = require("cors");
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
    origin: "http://localhost:3000",
  })
);

// Définition des en-têtes CORS de base pour les requêtes entrantes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api', router)

module.exports = app;
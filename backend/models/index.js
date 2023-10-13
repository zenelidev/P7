const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, {ssl:true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

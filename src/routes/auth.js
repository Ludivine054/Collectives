const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Définir le modèle User avec Mongoose
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Méthode pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Accès refusé, aucun token fourni.');

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Token invalide.');
  }
};

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('Utilisateur déjà enregistré.');
    }

    user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.status(201).send({ token });
  } catch (err) {
    res.status(500).send('Erreur du serveur.');
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Utilisateur ou mot de passe invalide.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Utilisateur ou mot de passe invalide.');

    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(500).send('Erreur du serveur.');
  }
});

// Route de déconnexion
router.post('/logout', authMiddleware, (req, res) => {
  res.status(200).send('Déconnecté avec succès.');
});

// Exemple de route protégée
router.get('/protected', authMiddleware, (req, res) => {
  res.send('Contenu protégé accessible uniquement aux utilisateurs authentifiés.');
});

module.exports = router;

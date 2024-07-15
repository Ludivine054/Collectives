const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simulation d'une base de données des utilisateurs
const users = [];

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Vérifier si l'utilisateur existe déjà
        let user = users.find(user => user.email === email);
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Chiffrer le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer et enregistrer le nouvel utilisateur
        user = { email, password: hashedPassword };
        users.push(user);

        // Générer un jeton JWT
        const payload = { user: { email: user.email } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Vérifier si l'utilisateur existe
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Générer un jeton JWT
        const payload = { user: { email: user.email } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.logout = (req, res) => {
    // Logique pour la déconnexion (par exemple, invalider le jeton côté client)
    res.json({ msg: 'User logged out' });
};

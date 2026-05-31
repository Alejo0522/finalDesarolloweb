const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al registrar' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ 
            message: 'Login exitoso', 
            token,
            username: user.username 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
};

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

const generateToken = (id) => {
    return jwt.sign({ _id:id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password, phone} = req.body;

        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({ error: "USER_EXISTS", message: "User Already exists" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        })
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } catch (error) {
        return res.status(500).json({ error: "SERVER_ERROR", message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid Credentials" });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid Credentials" });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "SERVER_ERROR", message: "Internal Server Error" });
    }
}

export { registerUser, loginUser }

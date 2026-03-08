import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    const header = req.headers.authorization;

    if (header && header.startsWith('Bearer')) {
        try {
            token = header.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded._id).select("-password");

            if (!user) {
                return res.status(401).json({ msg: "User not found" });
            }

            req.user = user;

            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ msg: "Not authorized" });
        }

    } else {
        return res.status(401).json({ msg: "No token provided" });
    }
}

export default protect;
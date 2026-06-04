import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ✅ FIX: remove "Bearer "
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ FIX: most common is decoded.id
        req.userId = decoded.id || decoded._id;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default protect;
import jsonwebtoken from "jsonwebtoken";


export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token ;
    if (!token) {
        return res.status(401).json({ message: "Access Denied, Please Login" });
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
}

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Get the token from cookies, body, or headers
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        // If the token is missing, return an error response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required",
            });
        }

        // Verify and decode the token
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log("Decoded Token:", decoded);

            req.user = decoded;
            req.id = decoded.userId; 
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                error: err.message, 
            });
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
            error: err.message, 
        });
    }
};

export default isAuthenticated;

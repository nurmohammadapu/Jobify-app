import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication failed. Token not found.",
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token. Please log in again.",
                success: false,
            });
        }

        // Attach user ID to the request object
        req.id = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            console.error("Authentication error: Token expired");
            return res.status(401).json({
                message: "Session expired. Please log in again.",
                success: false,
            });
        } else if (error.name === "JsonWebTokenError") {
            console.error("Authentication error: Invalid token");
            return res.status(401).json({
                message: "Invalid token. Please log in again.",
                success: false,
            });
        }

        // Log unexpected errors
        console.error("Authentication error:", error);

        // Return a generic error response
        return res.status(500).json({
            message: "An error occurred during authentication. Please try again later.",
            success: false,
        });
    }
};

export default isAuthenticated;

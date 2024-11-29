import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // get token 
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        // if token missing then return response 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required",
            });
        }

        // verify the token  
        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decode);
            req.user = decode;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                error: err.message,  // Include the error message from JWT verification
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
            error: err.message,  // Include the error message for debugging
        });
    }
};

export default isAuthenticated;

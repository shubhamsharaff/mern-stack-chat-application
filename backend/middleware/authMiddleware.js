const jwt = require("jsonwebtoken");  
const User = require("../models/userModel.js"); 
const asyncHandler = require("express-async-handler"); 

const protect = asyncHandler(async (req, res, next) => {
  let token;  // Initialize a variable to store the JWT token.

  // Check if the request headers contain an authorization header starting with "Bearer".
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];  // Extract the token from the authorization header.

      // Verify and decode the JWT token using the secret key.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the decoded user ID from the token.
      // Exclude the password field from the retrieved user data.
      req.user = await User.findById(decoded.id).select("-password");

      next();  // Call the next middleware after successfully verifying the token.
    } catch (error) {
      res.status(401);  // Set the response status to 401 (Unauthorized).
      throw new Error("Not authorized, token failed");  // Throw an error indicating token verification failure.
    }
  }

  // If no token was found in the authorization header, respond with a 401 status.
  if (!token) {
    res.status(401);  // Set the response status to 401 (Unauthorized).
    throw new Error("Not authorized, no token");  // Throw an error indicating no token was provided.
  }
});

module.exports = { protect };  // Export the 'protect' middleware for use in other parts of the application.

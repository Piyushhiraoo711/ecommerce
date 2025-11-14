import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user)
      return res.status(401).json({ success: false, message: "Invalid user" });

    req.user = user; 
   
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default verifyToken;



// // import jwt from "jsonwebtoken";

// // const verifyToken = async (req, res, next) => {
// //   try {
// //     const token = req.cookies.token;
// //     console.log("token", token);

// //     if (!token) {
// //       return res.status(401).json({
// //         message: "User not authenticated",
// //         success: false,
// //       });
// //     }
// //     const tokenDecode = await jwt.verify(token, process.env.TOKEN_KEY);
// //     if (!tokenDecode) {
// //       return res.status(401).json({
// //         message: "Invalid token",
// //         success: false,
// //       });
// //     }
// //     console.log("token", userId);
// //     req.id = tokenDecode.userId;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json("Invalid token");
// //   }
// // };

// // export default verifyToken;


// import jwt from "jsonwebtoken";

// const verifyToken = (req, res, next) => {
//   try {
//     const token = req.cookies.token; 

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

   
//     const decoded = jwt.verify(token, process.env.TOKEN_KEY);

//     if (!decoded) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       });
//     }

//     req.userId = decoded.userId; 
//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// export default verifyToken;


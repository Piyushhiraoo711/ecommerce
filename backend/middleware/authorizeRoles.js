const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Permission restricted",
      });
    }
    next();
  };
};

export default authorizeRoles;
function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }
    next();
  };
}

module.exports = requireRole;

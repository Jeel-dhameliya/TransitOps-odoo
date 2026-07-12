const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Check if auth middleware successfully loaded the user
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // 2. Check if the user's role is explicitly allowed for this route[cite: 1]
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access denied for role '${req.user.role}'` 
      });
    }

    next(); // Access granted! Move to controller logic
  };
};

module.exports = { authorizeRoles };
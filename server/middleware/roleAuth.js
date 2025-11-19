const User = require('../models/User');

// Check if user has required role
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const user = await User.findById(req.user.id).select('+role');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user has required role
      const userRole = user.role || 'user';
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
        });
      }

      req.user.role = userRole;
      req.user.theaterIds = user.theaterIds;
      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during authorization'
      });
    }
  };
};

// Specific role middlewares
const requireAdmin = requireRole(['admin']);
const requireTheaterOwner = requireRole(['theater_owner']);
const requireAdminOrTheaterOwner = requireRole(['admin', 'theater_owner']);

// Check if user owns the theater (for theater owners)
const requireTheaterOwnership = async (req, res, next) => {
  try {
    const { theaterId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Admins can access any theater
    if (user.role === 'admin') {
      return next();
    }

    // Theater owners can only access their own theaters
    if (user.role === 'theater_owner' && user.theaterIds.includes(theaterId)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'You can only manage your own theaters'
    });
  } catch (error) {
    console.error('Theater ownership check error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during ownership verification'
    });
  }
};

module.exports = {
  requireRole,
  requireAdmin,
  requireTheaterOwner,
  requireAdminOrTheaterOwner,
  requireTheaterOwnership
};

const jwt = require('jsonwebtoken');
const { Admin } = require('../models/Schemas');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345!');
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Force password change on first login
    if (admin.isFirstLogin && req.path !== '/auth/change-password' && req.path !== '/api/auth/change-password') {
      return res.status(403).json({ 
        message: 'Password change required on first login',
        isFirstLogin: true 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;

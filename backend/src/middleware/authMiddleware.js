const { verifyJWT } = require('../utils/tokenUtils');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
}

module.exports = authMiddleware;

function permit(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).end();
    if (allowed.includes(req.user.role) || req.user.role === 'admin') return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}
module.exports = { permit };

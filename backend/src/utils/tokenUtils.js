const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { v4: uuidv4 } = require('uuid');

function generateJWT(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

function verifyJWT(token) {
  return jwt.verify(token, jwtSecret);
}

function generateVerificationToken() {
  return uuidv4();
}

function generateResetToken() {
  return uuidv4();
}

module.exports = { generateJWT, verifyJWT, generateVerificationToken, generateResetToken };

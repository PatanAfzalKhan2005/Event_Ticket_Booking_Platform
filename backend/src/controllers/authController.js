const User = require('../models/User')
const { generateJWT, generateVerificationToken, generateResetToken } = require('../utils/tokenUtils')
const emailService = require('../services/emailService')

function handleError(res, next, err) {
  if (typeof next === 'function') return next(err)
  return res.status(500).json({ message: err.message || 'Server error' })
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body
    const user = await User.create({ name, email, password, role })

    const token = user.verificationToken || generateVerificationToken()
    user.verificationToken = token
    await user.save()

    emailService.sendVerification(user.email, token).catch(console.error)

    res.status(201).json({
      success: true,
      userId: user._id,
      message: 'User registered successfully'
    })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await user.matchPassword(password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const token = generateJWT({ id: user._id, role: user.role })
    res.json({ token })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params
    const user = await User.findOne({ verificationToken: token })

    if (!user) return res.status(400).json({ message: 'Invalid token' })

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    res.json({ ok: true })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.json({ ok: true })

    const token = generateResetToken()
    user.resetPasswordToken = token
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    emailService.sendReset(user.email, token).catch(console.error)
    res.json({ ok: true })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() }
    })

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save()

    res.json({ ok: true })
  } catch (err) {
    return handleError(res, next, err)
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select(
      '-password -verificationToken -resetPasswordToken -resetPasswordExpire'
    )

    res.json({ user })
  } catch (err) {
    return handleError(res, next, err)
  }
}

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword, me }

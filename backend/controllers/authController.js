import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePhoto = req.body.profilePhoto !== undefined ? req.body.profilePhoto : user.profilePhoto;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
    user.github = req.body.github !== undefined ? req.body.github : user.github;
    user.portfolio = req.body.portfolio !== undefined ? req.body.portfolio : user.portfolio;
    user.technicalSkills = req.body.technicalSkills !== undefined ? req.body.technicalSkills : user.technicalSkills;
    user.softSkills = req.body.softSkills !== undefined ? req.body.softSkills : user.softSkills;
    user.education = req.body.education !== undefined ? req.body.education : user.education;
    user.customPlatforms = req.body.customPlatforms !== undefined ? req.body.customPlatforms : user.customPlatforms;

    if (req.body.password) {
      if (req.body.currentPassword) {
        if (await user.matchPassword(req.body.currentPassword)) {
          user.password = req.body.password;
        } else {
          return res.status(401).json({ message: 'Invalid current password' });
        }
      } else {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: 'There is no user with that email' });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url dynamically based on origin
  const origin = req.headers.origin || 'http://localhost:5173';
  const resetUrl = `${origin}/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    const previewUrl = await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    console.log(`Reset URL: ${resetUrl}`); // For easy local testing
    res.status(200).json({ success: true, data: 'Email sent', previewUrl });
  } catch (error) {
    console.error('Email failed to send:', error.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ message: 'Email could not be sent' });
  }
};

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
  });
};

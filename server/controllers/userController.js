import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate password length
    if (password && password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user', // Strictly set to 'user' for public registration
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user role & permissions (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
  try {
    console.log('UPDATING USER:', req.params.id);
    console.log('UPDATE BODY:', req.body);

    const user = await User.findById(req.params.id);

    if (user) {
      if (req.body.role) user.role = req.body.role;
      if (req.body.permissions) user.permissions = req.body.permissions;
      if (req.body.employeeType !== undefined) user.employeeType = req.body.employeeType;

      const updatedUser = await user.save();
      console.log('USER UPDATED SUCCESSFULLY:', updatedUser._id);
      
      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          permissions: updatedUser.permissions,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('UPDATE ERROR:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });
    if (target.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete an admin account' });
    }
    if (target._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Cannot delete your own account' });
    }

    // Delete all content created by this user
    const { default: Article } = await import('../models/Article.js');
    const { default: LiveNews } = await import('../models/LiveNews.js');
    const { default: Video } = await import('../models/Video.js');
    await Promise.all([
      Article.deleteMany({ $or: [{ author: target._id }, { createdBy: target._id }] }),
      LiveNews.deleteMany({ createdBy: target._id }),
      Video.deleteMany({ createdBy: target._id }),
    ]);

    await target.deleteOne();
    res.json({ success: true, message: 'User and their content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user profile (Current user)
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

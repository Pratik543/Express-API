/**
 * Authentication controller
 * Note: This is a demo implementation. In production, use proper authentication libraries
 * and password hashing (bcrypt, JWT, etc.)
 */

// Simulated user database
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
];

// Login endpoint
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // In production, generate a proper JWT token
  const mockToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token: mockToken,
    },
  });
};

// Logout endpoint
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  // In production, verify token and get user from database
  res.json({
    success: true,
    data: {
      id: 1,
      username: 'admin',
      role: 'admin',
    },
  });
};

module.exports = {
  login,
  logout,
  getCurrentUser,
};

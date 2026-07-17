/**
 * User controller - handles user-related operations
 */

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
];

// Get all users
const getAllUsers = (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
};

// Get user by ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${id} not found`,
    });
  }

  res.json({
    success: true,
    data: user,
  });
};

// Create new user
const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user',
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser,
  });
};

// Update user
const updateUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${id} not found`,
    });
  }

  const { name, email, role } = req.body;
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    role: role || users[userIndex].role,
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex],
  });
};

// Delete user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${id} not found`,
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser,
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

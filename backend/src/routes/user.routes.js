const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
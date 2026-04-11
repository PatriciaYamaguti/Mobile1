const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  savePassword,
  listPasswords,
  deletePassword,
} = require('../controllers/passwordHistoryController');

const router = Router();

router.post('/passwords', authMiddleware, savePassword);
router.get('/passwords', authMiddleware, listPasswords);
router.delete('/passwords/:id', authMiddleware, deletePassword);

module.exports = router;

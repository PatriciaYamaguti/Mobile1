const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { signin, signup, signout } = require('../controllers/authController');

const router = Router();

router.get('/signin', signin);
router.post('/signin', signin);
router.post('/signup', signup);
router.get('/signout', authMiddleware, signout);

module.exports = router;

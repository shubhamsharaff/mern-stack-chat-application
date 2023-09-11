const express = require("express")
const router = express.Router()
const { registerUser, authUser, allUsers } = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', authUser)
router.get('/', protect, allUsers)

module.exports = router;
const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { updateProfile } = require("../controllers/profileController");

router.put("/profile", auth, updateProfile);

module.exports = router;

const router = require("express").Router();
const { register, login, getMe } = require("../controllers/authController");
const passport = require("passport");
const auth = require("../middlewares/authMiddleware");

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;

    res.redirect(`http://localhost:5173/login?token=${token}`);
  },
);

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);

module.exports = router;

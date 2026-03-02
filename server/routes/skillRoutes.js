const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  getAllSkills,
  addOfferedSkill,
  addWantedSkill,
} = require("../controllers/skillController");

router.get("/", getAllSkills);
router.post("/offered", auth, addOfferedSkill);
router.post("/wanted", auth, addWantedSkill);

module.exports = router;

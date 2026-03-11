const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  getAllSkills,
  addOfferedSkill,
  addWantedSkill,
  getOfferedSkills,
  getWantedSkills,
} = require("../controllers/skillController");

router.get("/", getAllSkills);

router.post("/offered", auth, addOfferedSkill);
router.post("/wanted", auth, addWantedSkill);

router.get("/offered", auth, getOfferedSkills);
router.get("/wanted", auth, getWantedSkills);

module.exports = router;

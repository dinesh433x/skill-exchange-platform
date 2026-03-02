const supabase = require("../utils/supabase");

// GET all predefined skills
exports.getAllSkills = async (req, res) => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("name");

  if (error) return res.status(500).json(error);

  res.json(data);
};

// ADD skill offered
exports.addOfferedSkill = async (req, res) => {
  const { skillId, level } = req.body;

  const { error } = await supabase.from("user_skills_offered").insert([
    {
      user_id: req.user.userId,
      skill_id: skillId,
      level,
    },
  ]);

  if (error) return res.status(500).json(error);

  res.json({ message: "Skill added to offered" });
};

// ADD skill wanted
exports.addWantedSkill = async (req, res) => {
  const { skillId } = req.body;

  const { error } = await supabase.from("user_skills_wanted").insert([
    {
      user_id: req.user.userId,
      skill_id: skillId,
    },
  ]);

  if (error) return res.status(500).json(error);

  res.json({ message: "Skill added to wanted" });
};

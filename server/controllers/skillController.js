const supabase = require("../utils/supabase");

//GET ALL AVAILABLE SKILLS

exports.getAllSkills = async (req, res) => {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("name");

  if (error) return res.status(500).json(error);

  res.json(data);
};

//ADD SKILL OFFERED

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

//ADD SKILL WANTED

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

//GET USER OFFERED SKILLS

exports.getOfferedSkills = async (req, res) => {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from("user_skills_offered")
    .select(
      `
      id,
      level,
      skills (
        name
      )
    `,
    )
    .eq("user_id", userId);

  if (error) return res.status(500).json(error);

  const formatted = data.map((item) => ({
    id: item.id,
    name: item.skills.name,
    level: item.level,
  }));

  res.json(formatted);
};

//GET USER WANTED SKILLS

exports.getWantedSkills = async (req, res) => {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from("user_skills_wanted")
    .select(
      `
      id,
      skills (
        name
      )
    `,
    )
    .eq("user_id", userId);

  if (error) return res.status(500).json(error);

  const formatted = data.map((item) => ({
    id: item.id,
    name: item.skills.name,
  }));

  res.json(formatted);
};

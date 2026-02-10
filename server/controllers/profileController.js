const supabase = require("../utils/supabase");

exports.updateProfile = async (req, res) => {
  const { bio } = req.body;

  const { error } = await supabase
    .from("users")
    .update({ bio })
    .eq("id", req.user.userId);

  if (error) return res.status(500).json(error);

  res.json({ message: "Profile updated" });
};

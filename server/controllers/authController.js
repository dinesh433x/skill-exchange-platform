const supabase = require("../utils/supabase");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

// register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }])
    .select()
    .single();

  if (error) return res.status(500).json(error);

  const token = signToken({ userId: user.id });

  res.json({ token, user });
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: user.id });

  res.json({ token, user });
};

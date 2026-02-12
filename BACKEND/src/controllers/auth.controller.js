const prisma = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/hash");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({ token, role: user.role });
};

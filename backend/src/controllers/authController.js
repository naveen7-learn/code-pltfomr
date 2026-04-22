import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createToken } from "../utils/createToken.js";

const authResponse = (user) => ({
  token: createToken(user._id),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  }
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  user.lastSeenAt = new Date();
  await user.save();
  res.json(authResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

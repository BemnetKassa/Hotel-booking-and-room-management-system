import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";

/* ================================
   ✅ USER REGISTRATION
================================ */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const { data: existing, error: existingErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ignore "no rows found" error
    if (existingErr && existingErr.code !== "PGRST116") {
      throw existingErr;
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error: insertErr } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashed,
          role: "user",
        },
      ])
      .select("id, name, email, role")
      .single();

    if (insertErr) throw insertErr;

    const token = signToken({ id: newUser.id, role: newUser.role });

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================================
   ✅ USER LOGIN
================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password, role")
      .eq("email", email)
      .eq("role", "user") // ✅ only normal users
      .single();

    if (!user || error) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, role: user.role });

    delete user.password;

    res.json({ user, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================================
   ✅ ADMIN LOGIN (ONLY seeded admin)
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const { data: admin, error } = await supabase
      .from("users")
      .select("id, name, email, password, role")
      .eq("email", email)
      .eq("role", "admin") // ✅ admin only
      .single();

    if (!admin || error)
      return res.status(400).json({ message: "Invalid admin credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid admin credentials" });

    const token = signToken({ id: admin.id, role: admin.role });

    delete admin.password;

    res.json({ user: admin, token });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Admin login failed" });
  }
};

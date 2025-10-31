import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";

/**
 * Register normal user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error } = await supabase
      .from("User")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role: "user",
        },
      ])
      .select("id, name, email, role")
      .single();

    if (error) throw error;

    // Sign JWT
    const token = signToken({ id: newUser.id, email: newUser.email, role: "user" });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("register error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

/**
 * Login (for both user and admin)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Check if user/admin exists
    const { data: user, error } = await supabase
      .from("User")
      .select("id, name, email, password, role")
      .eq("email", email)
      .single();

    if (error || !user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ If admin — must match seeded credentials
    if (user.role === "admin") {
      console.log("Admin logged in:", user.email);
    }

    // Create JWT
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    delete user.password;

    res.json({ user, token });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// src/controllers/authController.js
import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Check existing user
    const { data: existingUser, error: existingError } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (existingError && existingError.code !== "PGRST116") {
      // ignore 'No rows found' error
      throw existingError;
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from("User")
      .insert([
        {
          name,
          email,
          password: hashed,
          role: role || "user",
        },
      ])
      .select("id, name, email, role")
      .single();

    if (insertError) throw insertError;

    // Create JWT
    const token = signToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (err) {
    console.error("register error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find user by email
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

    // Sign JWT
    const token = signToken({ id: user.id, email: user.email });

    // Remove password before sending
    delete user.password;

    res.json({ user, token });
  } catch (err) {
    console.error("login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

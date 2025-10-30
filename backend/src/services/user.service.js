import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";

/**
 * createAdmin - Create an admin user (for initial setup)
 */
export const createAdmin = async ({ name, email, password }) => {
  // Check if user already exists
  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) throw new Error("Email already in use");
  if (findError && findError.code !== "PGRST116") throw findError; // ignore "No record found"

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([
    { name, email, password: hashed, role: "admin" },
  ]).select().single();

  if (error) throw error;

  const token = signToken({ id: data.id, role: data.role });
  const { password: _, ...safeUser } = data;
  return { user: safeUser, token };
};

/**
 * createUser - Create a regular user (for customer registration)
 */
export const createUser = async ({ name, email, password }) => {
  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) throw new Error("Email already in use");
  if (findError && findError.code !== "PGRST116") throw findError;

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([
    { name, email, password: hashed, role: "user" },
  ]).select().single();

  if (error) throw error;

  const token = signToken({ id: data.id, role: data.role });
  const { password: _, ...safeUser } = data;
  return { user: safeUser, token };
};

/**
 * loginAdmin - Authenticate only admin users
 */
export const loginAdmin = async ({ email, password }) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) throw new Error("Invalid credentials");
  if (user.role !== "admin") throw new Error("Access denied");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken({ id: user.id, role: user.role });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * loginUser - Authenticate regular users
 */
export const loginUser = async ({ email, password }) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken({ id: user.id, role: user.role });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * getAllUsers - Retrieve all users (admin view)
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * getUserById - Retrieve a single user by ID
 */
export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", id)
    .single();

  if (error) throw new Error("User not found");
  return data;
};

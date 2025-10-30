import { supabase } from "../config/supabase.js";

/**
 * Get rooms optionally filtered (e.g., by status, type, price range)
 */
export const getAllRooms = async (filter = {}) => {
  let query = supabase.from("rooms").select("*").order("room_number", { ascending: true });

  if (filter.status) query = query.eq("status", filter.status);
  if (filter.type) query = query.eq("type", filter.type);
  if (filter.minPrice) query = query.gte("price", Number(filter.minPrice));
  if (filter.maxPrice) query = query.lte("price", Number(filter.maxPrice));

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get a room by ID including its bookings
 */
export const getRoomById = async (id) => {
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*, bookings(*)")
    .eq("id", id)
    .order("bookings.check_in_date", { ascending: false })
    .single();

  if (error) throw new Error(error.message);
  return room;
};

/**
 * Create a new room
 */
export const createRoom = async (data) => {
  const { data: room, error } = await supabase
    .from("rooms")
    .insert([
      {
        room_number: data.roomNumber,
        type: data.type,
        price: Number(data.price),
        status: data.status ?? "Vacant",
        description: data.description ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return room;
};

/**
 * Update room information
 */
export const updateRoom = async (id, data) => {
  const updateData = {};
  if (data.roomNumber) updateData.room_number = data.roomNumber;
  if (data.type) updateData.type = data.type;
  if (typeof data.price !== "undefined") updateData.price = Number(data.price);
  if (data.status) updateData.status = data.status;
  if (data.description !== undefined) updateData.description = data.description;

  const { data: room, error } = await supabase
    .from("rooms")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return room;
};

/**
 * Delete a room
 */
export const deleteRoom = async (id) => {
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
};

/**
 * Update room status (Vacant, Occupied, Cleaning, Maintenance)
 */
export const updateRoomStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("rooms")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Check if a room is available for the given date range
 */
export const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  const { data: overlapping, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .neq("status", "Cancelled")
    .lt("check_in_date", checkOutDate)
    .gt("check_out_date", checkInDate)
    .maybeSingle(); // returns null if no match

  if (error && error.code !== "PGRST116") throw new Error(error.message); // ignore "no rows" error

  return !Boolean(overlapping);
};

/**
 * Find an available room for given dates and optional type
 */
export const findAvailableRoom = async (checkInDate, checkOutDate, type = null) => {
  let query = supabase.from("rooms").select("*").order("price", { ascending: true });
  if (type) query = query.eq("type", type);

  const { data: rooms, error } = await query;
  if (error) throw new Error(error.message);

  for (const room of rooms) {
    const ok = await isRoomAvailable(room.id, checkInDate, checkOutDate);
    if (ok) return room;
  }
  return null;
};

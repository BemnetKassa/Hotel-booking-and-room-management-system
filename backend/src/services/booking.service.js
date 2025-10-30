import { supabase } from "../config/supabase.js";
import { isRoomAvailable, updateRoomStatus } from "./room.service.js";

export const createBooking = async (bookingData) => {
  const {
    roomId,
    customerName,
    phoneNumber,
    email,
    checkInDate,
    checkOutDate,
    totalAmount,
  } = bookingData;

  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);
  if (inDate >= outDate) throw new Error("checkOutDate must be after checkInDate");

  let roomToBook = null;

  if (roomId) {
    // check room exists
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError || !room) throw new Error("Room not found");

    const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
    if (!available) throw new Error("Room not available for these dates");

    roomToBook = room;
  } else {
    // fallback to first available room
    const { data: rooms, error } = await supabase.from("rooms").select("*");
    if (error) throw new Error(error.message);

    for (const r of rooms) {
      const available = await isRoomAvailable(r.id, checkInDate, checkOutDate);
      if (available) {
        roomToBook = r;
        break;
      }
    }

    if (!roomToBook) throw new Error("No rooms available for selected dates");
  }

  const { data: booking, error: createError } = await supabase
    .from("bookings")
    .insert([
      {
        room_id: roomToBook.id,
        customer_name: customerName,
        phone_number: phoneNumber,
        email,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_amount: totalAmount ?? 0,
        status: "Pending",
        payment_status: "Unpaid",
      },
    ])
    .select()
    .single();

  if (createError) throw new Error(createError.message);

  // Update room status if currently occupied
  const now = new Date();
  if (inDate <= now && outDate > now) {
    await updateRoomStatus(roomToBook.id, "Occupied");
  }

  return booking;
};

export const getBookingById = async (id) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, rooms(*)")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getAllBookings = async (filters = {}) => {
  let query = supabase.from("bookings").select("*, rooms(*)").order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.roomId) query = query.eq("room_id", filters.roomId);
  if (filters.from) query = query.gte("check_in_date", filters.from);
  if (filters.to) query = query.lte("check_out_date", filters.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const getBookingsByRoom = async (roomId) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, rooms(*)")
    .eq("room_id", roomId)
    .order("check_in_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const cancelBooking = async (id) => {
  const { data: booking, error: findError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (findError || !booking) throw new Error("Booking not found");

  const { error: cancelError } = await supabase
    .from("bookings")
    .update({ status: "Cancelled" })
    .eq("id", id);

  if (cancelError) throw new Error(cancelError.message);

  const now = new Date();
  const { data: overlapping } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", booking.room_id)
    .neq("status", "Cancelled")
    .lt("check_in_date", now.toISOString())
    .gt("check_out_date", now.toISOString())
    .maybeSingle();

  if (!overlapping) {
    await supabase
      .from("rooms")
      .update({ status: "Vacant" })
      .eq("id", booking.room_id);
  }

  return { success: true };
};

export const confirmBooking = async (id) => {
  const { data: booking, error: findError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (findError || !booking) throw new Error("Booking not found");

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "Confirmed" })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);

  const now = new Date();
  if (booking.check_in_date <= now && booking.check_out_date > now) {
    await supabase
      .from("rooms")
      .update({ status: "Occupied" })
      .eq("id", booking.room_id);
  }

  return { success: true };
};

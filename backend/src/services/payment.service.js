import { supabase } from "../config/supabase.js";

/**
 * processPayment - records a transaction and updates booking.payment_status.
 * input: { bookingId, amount, method }
 */
export const processPayment = async ({ bookingId, amount, method }) => {
  // 1️⃣ Validate booking exists
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) throw new Error("Booking not found");

  // 2️⃣ Create transaction record (assume success for now)
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .insert([
      {
        booking_id: booking.id,
        amount: Number(amount),
        method,
        status: "Completed", // change if integrating real gateway
      },
    ])
    .select()
    .single();

  if (txError) throw new Error(txError.message);

  // 3️⃣ Update booking payment + status
  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      payment_status: "Paid",
      status: booking.status === "Pending" ? "Confirmed" : booking.status,
    })
    .eq("id", booking.id);

  if (updateError) throw new Error(updateError.message);

  // 4️⃣ Optionally mark room as occupied if check-in is current
  const now = new Date();
  if (new Date(booking.check_in_date) <= now && new Date(booking.check_out_date) > now) {
    const { error: roomError } = await supabase
      .from("rooms")
      .update({ status: "Occupied" })
      .eq("id", booking.room_id);

    if (roomError) throw new Error(roomError.message);
  }

  // 5️⃣ Return transaction + booking info
  const { data: fullTx, error: fetchError } = await supabase
    .from("transactions")
    .select("*, bookings(*)")
    .eq("id", transaction.id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  return fullTx;
};

export const getAllTransactions = async (filters = {}) => {
  let query = supabase
    .from("transactions")
    .select("*, bookings(*)")
    .order("created_at", { ascending: false });

  if (filters.method) query = query.eq("method", filters.method);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", filters.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data;
};

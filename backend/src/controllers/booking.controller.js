import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkInDate,
      checkOutDate,
    });

    await Room.findByIdAndUpdate(roomId, { status: "Booked" });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await Room.findByIdAndUpdate(booking.room, { status: "Available" });
    await booking.deleteOne();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

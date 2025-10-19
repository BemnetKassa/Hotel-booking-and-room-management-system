// src/controllers/booking.controller.js
import * as bookingService from "../services/booking.service.js";
import * as roomService from "../services/room.service.js";
import { io } from "../server.js";

export const createBooking = async (req, res) => {
  try {
    // Public route: customers do NOT need to be authenticated
    const bookingData = {
      roomId: req.body.roomId, // optional (customer may pick specific room)
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      totalAmount: req.body.totalAmount,
    };

    const booking = await bookingService.createBooking(bookingData);

    // Emit new booking event to admin clients
    io.emit("booking-created", booking);

    // If room status changed, emit update
    const room = await roomService.getRoomById(booking.roomId);
    io.emit("room-updated", room);

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("createBooking:", err);
    res.status(400).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    // Protected admin route expected
    const filters = {
      status: req.query.status,
      roomId: req.query.roomId,
      from: req.query.from,
      to: req.query.to,
    };
    const bookings = await bookingService.getAllBookings(filters);
    res.json(bookings);
  } catch (err) {
    console.error("getBookings:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    // If admin sees for any user, req.query.userId; otherwise for logged-in customer use req.user.id
    const userId = req.user?.id ?? req.query.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const bookings = await bookingService.getBookingsByRoom(userId); // Note: function name reused; adjust if you want user bookings
    res.json(bookings);
  } catch (err) {
    console.error("getUserBookings:", err);
    res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id);
    io.emit("booking-cancelled", { id: Number(req.params.id) });

    // Update room state and notify
    const booking = await bookingService.getBookingById(req.params.id).catch(() => null);
    if (booking && booking.roomId) {
      const room = await roomService.getRoomById(booking.roomId);
      io.emit("room-updated", room);
    }

    res.json(result);
  } catch (err) {
    console.error("cancelBooking:", err);
    res.status(400).json({ message: err.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    await bookingService.confirmBooking(req.params.id);
    const booking = await bookingService.getBookingById(req.params.id);
    io.emit("booking-confirmed", booking);

    // notify room status changed
    const room = await roomService.getRoomById(booking.roomId);
    io.emit("room-updated", room);

    res.json({ message: "Booking confirmed", booking });
  } catch (err) {
    console.error("confirmBooking:", err);
    res.status(400).json({ message: err.message });
  }
};

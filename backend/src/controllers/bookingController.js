import * as bookingService from '../services/bookingService.js';

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roomId, checkIn, checkOut } = req.body;
    const booking = await bookingService.createBooking({ userId, roomId: Number(roomId), checkIn: new Date(checkIn), checkOut: new Date(checkOut) });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const listBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.listBookings({ userId });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBooking(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

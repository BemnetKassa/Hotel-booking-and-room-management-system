import * as roomService from '../services/roomService.js';

export const createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await roomService.getRoom(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

export const listRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.listRooms();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

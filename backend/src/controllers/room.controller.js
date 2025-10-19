// src/controllers/room.controller.js
import * as roomService from "../services/room.service.js";
import { io } from "../server.js"; // ensure server.js exports io

export const getRooms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.minPrice) filter.minPrice = req.query.minPrice;
    if (req.query.maxPrice) filter.maxPrice = req.query.maxPrice;

    const rooms = await roomService.getAllRooms(filter);
    res.json(rooms);
  } catch (err) {
    console.error("getRooms:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    console.error("getRoomById:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const data = req.body;
    const room = await roomService.createRoom(data);
    // notify admin clients about new room
    io.emit("room-created", room);
    res.status(201).json(room);
  } catch (err) {
    console.error("createRoom:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    io.emit("room-updated", room);
    res.json(room);
  } catch (err) {
    console.error("updateRoom:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    io.emit("room-deleted", { id: Number(req.params.id) });
    res.json({ message: "Room deleted" });
  } catch (err) {
    console.error("deleteRoom:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const room = await roomService.updateRoomStatus(req.params.id, status);
    io.emit("room-status-update", room);
    res.json(room);
  } catch (err) {
    console.error("updateRoomStatus:", err);
    res.status(500).json({ message: err.message });
  }
};

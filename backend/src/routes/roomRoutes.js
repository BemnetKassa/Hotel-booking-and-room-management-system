import express from 'express';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/:id', roomController.getRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;

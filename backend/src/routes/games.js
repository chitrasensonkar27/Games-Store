import express from 'express';
import {
  getAllGames,
  getGame,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/gamesController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllGames)
  .post(createGame);

router
  .route('/:id')
  .get(getGame)
  .put(updateGame)
  .delete(deleteGame);

export default router;

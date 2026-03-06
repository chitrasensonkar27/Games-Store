import Game from '../models/Game.js';

// GET all games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET single game
export const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).lean();
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new game
export const createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json({
      success: true,
      data: game.toObject()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE game
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).lean();
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE game 
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Game deleted sucacessfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

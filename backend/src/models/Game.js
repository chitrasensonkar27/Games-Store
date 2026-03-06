import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  online_or_offline: { 
    type: String,
    enum: ['Online', 'Offline', 'both'], 
    required: [true, 'Online/Offline status is required']
  },
  subscription_price: {  
    type: Number,
    default: 0,
    min: 0
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  game_size: {  
    type: String,
    required: [true, 'Game size is required']
  },
  release_date: {  
    type: Date,
    required: [true, 'Release date is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['action', 'adventure', 'simulation', 'rpg', 'sports', 'puzzle', 'strategy', 'racing']  // ← lowercase
  },
  developer: {
    type: String,
    required: [true, 'Developer name is required'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: false },  // keep away extra junk feilds Clean JSON output
  toObject: { virtuals: false } // Clean object output
});

const Game = mongoose.model('Game', gameSchema);
export default Game;

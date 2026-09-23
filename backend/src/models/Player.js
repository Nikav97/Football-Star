import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerId: { type: Number, required: true },
  name: String,
  firstname: String,
  lastname: String,
  age: Number,
  nationality: String,
  photo: String,
  team: {
    id: Number,
    name: String,
    logo: String
  },
  league: {
    id: Number,
    name: String,
    country: String,
    season: Number
  },
  statistics: Object
});

// ✅ Unique index da spreči duplikate
playerSchema.index({ playerId: 1, "league.id": 1, "league.season": 1 }, { unique: true });

export default mongoose.model("Player", playerSchema);

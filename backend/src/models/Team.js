import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  logo: { type: String },
  founded: { type: Number },
  country: { type: String },
  venue: {
    name: String,
    city: String,
    capacity: Number
  },
  leagueId: { type: Number, required: true },
  season: { type: Number, required: true }
}, { timestamps: true });

// jedinstveni indeks: isti tim ne može dva puta u istoj sezoni
TeamSchema.index({ id: 1, season: 1 }, { unique: true });

export default mongoose.model("Team", TeamSchema);

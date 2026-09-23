import mongoose from "mongoose";

const LeagueTableSchema = new mongoose.Schema({
  leagueId: { type: Number, required: true },
  leagueName: { type: String }, // ime lige
  season: { type: Number, required: true },
  standings: { type: Array, required: true },
}, { timestamps: true });

LeagueTableSchema.index({ leagueId: 1, season: 1 }, { unique: true });

export default mongoose.model("LeagueTable", LeagueTableSchema);

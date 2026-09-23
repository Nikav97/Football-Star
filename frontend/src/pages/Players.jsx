import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePlayerStore from "../store/playersStore";
import { useAuth } from "../context/AuthContext";


function PlayerDetails({ viewMode = "cards" }) {
  const { leagueId, season, teamId } = useParams();
  const { players, loading, error, fetchPlayersByTeam } = usePlayerStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayersByTeam(teamId, season);
  }, [teamId, season, fetchPlayersByTeam]);

  if (loading) return <p>⏳ Loading players...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const teamName = players.length > 0 ? players[0].team?.name : `Team ${teamId}`;

  return (
    <div className="players-container">
      {/* Header sa login info */}
      <div className="header">
        <h1 className="title">⚽ Players for {teamName} ({season})</h1>
        {user && (
          <div className="user-info">
          <span className="user-badge">Ulogovan: {user.username}</span>
          <button className="logout-button" onClick={logout}>Logout</button>
          </div>
        )}
      </div>

      {/* Dugmad za redirect */}
      <div className="nav-buttons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate(`/teams/${leagueId}/${season}`)}>Teams</button>
        <button onClick={() => navigate(`/table/${leagueId}/${season}`)}>Tabela</button>
      </div>

      {/* Kartice */}
        <div className="grid">
          {players.map((p) => (
            <div key={p.playerId} className="card">
              <img src={p.photo} alt={p.name} className="player-photo" />
              <h2>{p.name}</h2>
              <p className="team">{p.team?.name}</p>
              <p className="position">{p.statistics?.games?.position || "N/A"}</p>
              <p>Appearances: {p.statistics?.games?.appearences || 0}</p>
              <p>Goals: {p.statistics?.goals?.total || 0}</p>
              <p>Assists: {p.statistics?.goals?.assists || 0}</p>
            </div>
          ))}
        </div>

    </div>
  );
}

export default PlayerDetails;

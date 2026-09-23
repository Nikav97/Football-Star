import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addLeagueSeason } from "../api/LigaApi";
import useLeagueStore from "../store/leagueStore";
import { useState } from "react";
import "../Dashboard.css";



<source />
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    users,
    leagues,
    fetchUsers,
    deleteUser,
    fetchLeagues,
    deleteLeagueSeason
  } = useLeagueStore();

  const [leagueId, setLeagueId] = useState("");
  const [season, setSeason] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddLeague = async (e) => {
    e.preventDefault();
    try {
      await addLeagueSeason(leagueId, season);
      alert("League/season added successfully!");
      setLeagueId("");
      setSeason("");
      fetchLeagues();
    } catch (err) {
      console.error("Error adding league:", err);
      alert("Failed to add league");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Welcome, <strong>{user ? user.username : "Guest"}</strong></p>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/")} className="btn btn-primary">🏠 Home</button>

        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        <button onClick={fetchUsers} className="btn btn-primary">Load Users</button>
        <button onClick={fetchLeagues} className="btn btn-secondary">Load Leagues</button>
      </div>

      {/* Users */}
      <section className="dashboard-section">
        <h2>👤 Users</h2>
        {users.length === 0 ? (
          <p>No users loaded yet.</p>
        ) : (
          <div className="user-grid">
            {users.map((u) => (
              <div key={u._id} className="user-card">
                <p><strong>{u.username}</strong></p>
                <p>{u.email}</p>
                <p className="role">{u.role}</p>
                <button onClick={() => deleteUser(u._id)} className="btn btn-danger">Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Leagues */}
      <section className="dashboard-section">
        <h2>🏆 Leagues</h2>
        {Object.entries(leagues).length === 0 ? (
          <p>No leagues loaded yet.</p>
        ) : (
          <table className="league-table">
            <thead>
              <tr>
                <th>League Name</th>
                <th>Season</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(leagues).map(([lid, obj]) =>
                obj.seasons.map((s) => (
                  <tr key={`${lid}-${s}`}>
                    <td>{obj.name}</td>
                    <td>{s}</td>
                    <td>
                      <button onClick={() => deleteLeagueSeason(lid, s)} className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* Add League Form */}
      <section className="dashboard-section">
        <h2>➕ Add League Season</h2>
        <form onSubmit={handleAddLeague} className="league-form">
          <div className="form-group">
            <label>League ID:</label>
            <input
              type="text"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Season:</label>
            <input
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Add</button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { getHealth } from "../api/healthapi.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLeagueStore from "../store/leagueStore";

function Home() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { league, season } = useLeagueStore();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealth();
        setMessage(data.message);
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchHealth();
  }, []);

return (
  <div className="home-container">
    {/* Header */}
    <div className="header">
      <h1>Football Stats Hub</h1>
      {user && (
        <div className="user-info">
          <span className="user-badge">Ulogovan: {user.username}</span>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      )}
    </div>

    <p className="health-message">{message}</p>

    {/* Navigacija */}
    <div className="nav-buttons">
      <button onClick={() => navigate(`/teams/${league}/${season}`)}>Timovi</button>
      <button onClick={() => navigate(`/table/${league}/${season}`)}>Tabela</button>

      {/* Admin dugme samo ako je email admin */}
      {isAdmin && (
        <button onClick={() => navigate("/dashboard")}>
          Admin Dashboard
        </button>
      )}
    </div>
  </div>
);
}

export default Home;

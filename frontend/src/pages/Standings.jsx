import React, { useEffect } from "react";
import useLeagueStore from "../store/leagueStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function StandingsTable() {
  const {
    league,
    season,
    options,
    teams,
    loading,
    error,
    setLeague,
    setSeason,
    setOptions,
    setTeams,
    setLoading,
    setError
  } = useLeagueStore();

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  // ako rute nose leagueId/season, postavi store na osnovu njih
  useEffect(() => {
    if (params.leagueId && params.season) {
      setLeague(params.leagueId);
      setSeason(params.season);
    }
  }, [params, setLeague, setSeason]);

  // povuci sve lige + sezone iz baze
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/leagues"); 
        const json = await res.json();
        setOptions(json.leagues || {});
        if (!league) {
          const firstLeagueId = Object.keys(json.leagues)[0];
          if (firstLeagueId) {
            setLeague(firstLeagueId);
            setSeason(json.leagues[firstLeagueId].seasons[0]);
          }
        }
      } catch (err) {
        console.error("Greška pri povlačenju opcija:", err);
        setError("Ne mogu da učitam liste liga/sezona");
      }
    }
    fetchOptions();
  }, [setOptions, setLeague, setSeason, setError, league]);

  // povuci standings iz baze
  useEffect(() => {
    async function fetchStandings() {
      if (!league || !season) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/leagues/${league}/${season}`
        );
        const json = await res.json();

        if (json.success && json.standings.length > 0) {
          const validTeams = json.standings.filter(t => t.team);
          setTeams(validTeams);
        } else {
          setTeams([]);
          setError(`Nema standings podataka za ligu ${league}, sezonu ${season}`);
        }
      } catch (err) {
        console.error("Greška pri povlačenju tabele:", err);
        setError("Greška pri povlačenju tabele");
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, [league, season, setTeams, setError, setLoading]);

  return (
    <div className="standings-container">
      {/* Header */}
      <div className="header">
        <h2>
          🏆 {options[league]?.name} – sezona {season}
        </h2>
        <div>
          {user && (
            <div className="user-info">
              <span className="user-badge">Ulogovan: {user.username}</span>
              <button className="logout-button" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Dugmad za redirect */}
      <div className="nav-buttons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate(`/teams/${league}/${season}`)}>Timovi</button>
        <button onClick={() => navigate(`/table/${league}/${season}`)}>Tabela</button>
      </div>

      {/* Dropdown */}
      <div className="dropdowns">
        <select
          value={league}
          onChange={(e) => {
            const lid = e.target.value;
            setLeague(lid);
            const seasons = options[lid].seasons;
            if (seasons.includes(season)) {
              setSeason(season);
            } else {
              setSeason(seasons[seasons.length - 1]);
            }
          }}
        >
          {Object.entries(options).map(([lid, obj]) => (
            <option key={lid} value={lid}>
              {obj.name}
            </option>
          ))}
        </select>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          {options[league]?.seasons.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>⏳ Učitavanje...</p>}
      {error && <p className="error">{error}</p>}

      {/* Tabela standings */}
      {!loading && !error && teams.length > 0 && (
        <table className="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tim</th>
              <th>Poeni</th>
              <th>Gol razlika</th>
              <th>Forma</th>
              <th>Odigrano</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={`${team.team?.name}-${season}`}>
                <td>{team.rank}</td>
                <td className="team-cell">
                  <img src={team.team?.logo} alt={team.team?.name} />
                  {/* <button
                    onClick={() => navigate(`/players/${league}/${season}/${team.team?.id}`)}
                  > */}
                    <Link 
                    to={`/players/${league}/${season}/${team.team?.id}`} 
                    className="team-link"
                  >
                    {team.team?.name}
                  </Link>
                </td>
                <td>{team.points}</td>
                <td>{team.goalsDiff}</td>
                <td>{team.form}</td>
                <td>{team.all?.played}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StandingsTable;

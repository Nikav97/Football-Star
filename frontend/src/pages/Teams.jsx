// import React, { useEffect } from "react";
// import useLeagueStore from "../store/leagueStore";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// function LeagueTeams() {
//   const {
//     league,
//     season,
//     options,
//     teams,
//     loading,
//     error,
//     setLeague,
//     setSeason,
//     setOptions,
//     setTeams,
//     setLoading,
//     setError
//   } = useLeagueStore();

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchOptions() {
//       try {
//         const res = await fetch("http://localhost:5000/api/external/table/league/list");
//         const json = await res.json();
//         setOptions(json.leagues || {});
//         const firstLeagueId = Object.keys(json.leagues)[0];
//         if (firstLeagueId) {
//           setLeague(firstLeagueId);
//           setSeason(json.leagues[firstLeagueId].seasons[0]);
//         }
//       } catch (err) {
//         setError("Ne mogu da učitam liste liga/sezona");
//       }
//     }
//     fetchOptions();
//   }, [setOptions, setLeague, setSeason, setError]);

//   useEffect(() => {
//     async function fetchTeams() {
//       if (!league || !season) return;
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/external/league/teams?league=${league}&season=${season}`
//         );
//         const json = await res.json();
//         if (json.success) {
//           setTeams(json.teams);
//         } else {
//           setTeams([]);
//           setError(`Nema timova za ligu ${league}, sezonu ${season}`);
//         }
//       } catch (err) {
//         setError("Greška pri povlačenju timova");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTeams();
//   }, [league, season, setTeams, setError, setLoading]);

//   return (
//     <div className="league-teams-container">
//       {/* Header */}
//       <div className="header">
//         <h2>⚽ Timovi – {options[league]?.name} ({season})</h2>
//         {user && (
//         <div className="user-info">
//           <span className="user-badge">Ulogovan: {user.username}</span>
//           <button className="logout-button" onClick={logout}>Logout</button>
//         </div>

//         )}
//       </div>

//       {/* Dropdown za ligu/sezonu */}
//       <div className="dropdowns">
//       <select
//         value={league}
//         onChange={(e) => {
//           const lid = e.target.value;
//           setLeague(lid);
//         }}
//       >
//         {Object.entries(options).map(([lid, obj]) => (
//           <option key={lid} value={lid}>
//             {obj.name}
//           </option>
//         ))}
//       </select>

//       <select
//         value={season}
//         onChange={(e) => setSeason(e.target.value)}
//       >
//         {options[league]?.seasons.map((s, idx) => (
//           <option key={idx} value={s}>
//             {s}
//           </option>
//         ))}
//       </select>


//       </div>

//       {/* Dugme za redirect na tabelu sa ligom i sezonom */}
//       <div className="redirect-button">
//         <button onClick={() => navigate("/")}>Home</button>
//         <button onClick={() => navigate(`/table/${league}/${season}`)}>
//           Pogledaj tabelu
//         </button>
  
//       </div>

//       {loading && <p>⏳ Učitavanje...</p>}
//       {error && <p className="error">{error}</p>}

//       {/* Kartice timova */}
//       {!loading && !error && teams.length > 0 && (
//         <div className="teams-grid">
//           {teams.map(t => (
//             <div key={t.id} className="team-card">
//               <img src={t.logo} alt={t.name} className="team-logo" />
//               <h3>{t.name}</h3>
//               <p>Osnovan: {t.founded}</p>
//               <p>{t.country}</p>
//               <p>
//                 Stadion: {t.venue?.name} ({t.venue?.city})<br />
//                 Kapacitet: {t.venue?.capacity}
//               </p>
//               <button onClick={() => navigate(`/players/${league}/${season}/${t.id}`)}>
//                 Pogledaj igrače
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default LeagueTeams;
import React, { useEffect } from "react";
import useLeagueStore from "../store/leagueStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LeagueTeams() {
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

  // povuci sve lige + sezone iz baze
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/leagues");
        const json = await res.json();
        setOptions(json.leagues || {});
        const firstLeagueId = Object.keys(json.leagues)[0];
        if (firstLeagueId) {
          setLeague(firstLeagueId);
          setSeason(json.leagues[firstLeagueId].seasons[0]);
        }
      } catch (err) {
        setError("Ne mogu da učitam liste liga/sezona");
      }
    }
    fetchOptions();
  }, [setOptions, setLeague, setSeason, setError]);

  // povuci timove iz baze
  useEffect(() => {
    async function fetchTeams() {
      if (!league || !season) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/leagues/${league}/${season}/teams`
        );
        const json = await res.json();
        if (json.success) {
          setTeams(json.teams);
        } else {
          setTeams([]);
          setError(`Nema timova za ligu ${league}, sezonu ${season}`);
        }
      } catch (err) {
        setError("Greška pri povlačenju timova");
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, [league, season, setTeams, setError, setLoading]);

  return (
    <div className="league-teams-container">
      {/* Header */}
      <div className="header">
        <h2>⚽ Timovi – {options[league]?.name} ({season})</h2>
        {user && (
          <div className="user-info">
            <span className="user-badge">Ulogovan: {user.username}</span>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
        )}
      </div>

      {/* Dropdown za ligu/sezonu */}
      <div className="dropdowns">
        <select
          value={league}
          onChange={(e) => setLeague(e.target.value)}
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

      {/* Dugme za redirect */}
      <div className="redirect-button">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate(`/table/${league}/${season}`)}>
          Pogledaj tabelu
        </button>
      </div>

      {loading && <p>⏳ Učitavanje...</p>}
      {error && <p className="error">{error}</p>}

      {/* Kartice timova */}
      {!loading && !error && teams.length > 0 && (
        <div className="teams-grid">
          {teams.map((t, idx) => (
            <div key={`${t?.id || idx}-${season}`} className="team-card">
              <img src={t.logo} alt={t.name} className="team-logo" />
              <h3>{t.name}</h3>
              <p>Osnovan: {t.founded}</p>
              <p>{t.country}</p>
              <p>
                Stadion: {t.venue?.name} ({t.venue?.city})<br />
                Kapacitet: {t.venue?.capacity}
              </p>
              <button onClick={() => navigate(`/players/${league}/${season}/${t.id}`)}>
                Pogledaj igrače
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeagueTeams;
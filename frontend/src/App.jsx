import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeagueTeams from "./pages/Teams";   // import tvoje komponente
import PlayerDetails from "./pages/Players";
import Dashboard from "./pages/Dashboard";
import StandingsTable from "./pages/Standings";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import "./App.css";   // globalni CSS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* javne rute */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* zaštićene rute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:leagueId/:season"
          element={
            <ProtectedRoute>
              <LeagueTeams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table/:leagueId/:season"
          element={
            <ProtectedRoute>
              <StandingsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:leagueId/:season/:teamId"
          element={
            <ProtectedRoute>
              <PlayerDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

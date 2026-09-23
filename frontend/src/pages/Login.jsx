import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLeagueStore from "../store/leagueStore";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // povuci league i season iz zustanda
  const { league, season } = useLeagueStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // koristi league i season iz zustanda
      navigate(`/teams/${league}/${season}`);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="register-redirect">
        <p>Nemate nalog?</p>
        <button onClick={() => navigate("/register")}>
          Registruj se
        </button>
      </div>
      <div className="forgot-password">
      <p>Zaboravili ste lozinku?</p>
      <button onClick={() => navigate("/forgot-password")}>
        Resetuj lozinku
      </button>
    </div>

    </div>
  );
};

export default Login;

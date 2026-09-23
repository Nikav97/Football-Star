import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();   // 👈 za navigaciju
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Lozinke se ne poklapaju");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/password/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) setMessage("Lozinka uspešno resetovana.");
      else setError(data.message);
    } catch {
      setError("Greška na serveru");
    }
  };

  return (
    <div>
      <h1>Reset lozinke</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Ponovi lozinku"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit">Resetuj</button>
      </form>

      {message && (
        <div>
          <p style={{ color: "green" }}>{message}</p>
          {/* 👇 Dugme za povratak na login */}
          <button onClick={() => navigate("/login")}>Vrati se na login</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;

import { useEffect, useState } from "react";
import { getHealth } from "../api/healthapi";

function Home() {
  const [message, setMessage] = useState("");

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
    <div>
      <h1>Football Stats Hub</h1>
      <p>{message}</p>
    </div>
  );
}

export default Home;
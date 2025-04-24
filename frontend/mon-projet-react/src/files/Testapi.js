import React, { useEffect, useState } from "react";
import axios from "axios";

function Testapi() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/weapons");
        setWeapons(res.data.weapons);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weapon data", err);
        setLoading(false);
      }
    };

    fetchWeapons();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>PUBG Weapons</h1>
      {loading ? (
        <p>Loading weapons...</p>
      ) : (
        <ul>
          {weapons.map((weapon, i) => (
            <li key={i}>{weapon}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Testapi;

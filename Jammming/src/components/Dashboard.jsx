import { useEffect, useState } from "react";
import { getAccessToken, getCode } from "../Spotify";

function Dashboard() {

  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAccessToken(token);
  }, []);

  const [displayName, setDisplayName] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        setDisplayName(data.display_name);
    }
  }, []);
  

  return (
    <div className="Dashboard">
      <h1>Welcome, {displayName}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}
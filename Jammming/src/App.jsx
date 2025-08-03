import { useEffect, useState } from 'react';
import secrets from './secrets/secrets'; // Must export { clientId: "..." }

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  // Step 1: Check for "code" in URL on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Exchange code for access token
      getAccessToken(secrets.clientId, code).then(token => {
        setAuthenticated(true);
        setToken(token);
        fetchProfile(token).then(data => setProfile(data));
      });
    }
  }, []);

  async function redirectToAuthCodeFlow() {
    const clientId = secrets.clientId;
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://jose69420xxx.github.io/index.html");
    params.append("scope", "user-read-private user-read-email playlist-modify-private playlist-modify-public");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://jose69420xxx.github.io");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
  }

  function generateCodeVerifier(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  return (
    <div>
      <h1>Hello 1</h1>
      {!authenticated ? (
        <button onClick={redirectToAuthCodeFlow}>Login with Spotify</button>
      ) : (
        <div>
          <h1>Welcome, {profile.display_name}!</h1>
        </div>
      )}
    </div>
  );
}

export default App;

import secrets from './secrets/secrets';
export const redirectUri = "https://jose69420xxx.github.io/index.html";
const clientId = secrets.clientId;


// Redirects the user to the Spotify authorization page
export async function redirectToAuthCodeFlow() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUri);
    params.append("scope", "user-read-private user-read-email playlist-modify-private playlist-modify-public");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}

export function generateCodeVerifier(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//Gets the authorization code from the URL parameters
export function getCode(){	
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");
	return code;
};

//This function fetches the access token using the authorization code and saves it tot he browser's local storage
export async function getAccessToken(code) {
    const verifier = localStorage.getItem("verifier");
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();
    localStorage.setItem("access_token", access_token);
    return access_token;
}

//This function checks if the browser has a token in local storage
export function isAuthenticated() {
  const token = localStorage.getItem("access_token");
  if( localStorage.getItem("access_token") && token !== "undefined" && token !== "null" ) {
    return true;
  }
  return false;
}

//This is the logout function that removes the access token and verifier from local storage and redirects the user to the home page
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("verifier");
  window.location.href = "/";
}

//This function fetches the user's profile information from Spotify
export async function getUserProfile() {
  try {
    const token = localStorage.getItem("access_token");
    const result = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (result.ok) {
      const profile = await result.json();
      return profile.display_name;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}



import { useEffect, useState} from 'react';
import { redirectToAuthCodeFlow, generateCodeChallenge,generateCodeVerifier } from '../Spotify.jsx';

function Login() {
    return (
        <div className="Login">
            <button onClick={redirectToAuthCodeFlow}>Log in with Spotify</button>
        </div>
    );
} 

export default Login;
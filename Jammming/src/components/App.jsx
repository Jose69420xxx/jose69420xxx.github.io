import { useEffect, useState } from 'react';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import { isAuthenticated } from '../Spotify.jsx';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  return (
    <div className="App">
      if(loggedIn){
        <Dashboard />
      } else {
        <Login />
      }
    </div>
  );
}

export default App;


import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { selectTheme } from './app/slices/uiSlice';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import GlobalPlayer from './Components/GlobalPlayer';

// Add your google client in '.env' file.
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
       {/* Add padding bottom to avoid content being hidden by the player. */}
      <div className="App pb-24">
        <Navbar />
        <main>
          <Home />
        </main>
        <GlobalPlayer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { toggleTheme, selectTheme } from "../app/slices/uiSlice";
import { loginSuccess, loginFailure, logout } from "../app/slices/authSlice";

export default function Navbar() {
  // Navbar for webstie with dark & light theme.
  const theme = useSelector(selectTheme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLoginSuccess = (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential);
    const userProfile = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };
    dispatch(loginSuccess(userProfile));
  };

  const handleLoginError = () => {
    dispatch(loginFailure("Google login failed."));
  };

  const handleLogout = () => {
    googleLogout();
    dispatch(logout());
  };

  return (
    <nav className="w-full flex justify-between items-center py-3 glass fixed top-0 px-4 sm:px-6 z-50">
      <div className="flex items-center gap-3">
        <img
          src="/Photos/Logo.png"
          alt="Wubble logo"
          className="h-8 sm:h-9 object-cover"
        />
        <h1 className="font-bold text-xl text-gray-800 dark:text-white tracking-wider hidden sm:block">
          Wubble QuickTune
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {!isAuthenticated ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            theme={theme === "dark" ? "filled_black" : "outline"}
            shape="pill"
          />
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-gray-800 dark:text-white font-medium hidden md:block">
              Welcome, {user.name.split(" ")[0]}!
            </span>
            <img
              src={user.picture}
              alt={user.name}
              className="h-9 w-9 rounded-full"
            />
            <button
              className="bg-black/10 hover:bg-black/20 dark:bg-white/20 dark:hover:bg-white/30 text-gray-800 dark:text-white py-1.5 px-3 rounded-full font-medium text-sm transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}

        <button
          onClick={handleThemeToggle}
          className="bg-white dark:bg-gray-800 px-2 py-1 flex items-center rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <i className="bi bi-moon-stars-fill text-white"></i>
          ) : (
            <i className="bi bi-sun-fill text-yellow-300"></i>
          )}
        </button>
      </div>
    </nav>
  );
}

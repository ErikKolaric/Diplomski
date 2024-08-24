import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { useAuth } from "../../auth/useAuth";

function Navigation() {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleCloseNavbar = () => {
    setShowNavbar(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("encodedData");
    handleCloseNavbar(); // Close the navbar on logout
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <h3 style={{ textTransform: "uppercase" }}>BrandBoost</h3>
          <div className="menu-icon" onClick={handleShowNavbar}>
            <AiOutlineMenu />
          </div>

          <div className={`nav-elements ${showNavbar ? "active" : ""}`}>
            <ul>
              <li onClick={handleCloseNavbar}>
                <Link to="/">Home</Link>
              </li>
              {user && (
                <li onClick={handleCloseNavbar}>
                  <Link to="/post-content">Post Content</Link>
                </li>
              )}

              {user && (
                <li onClick={handleCloseNavbar}>
                  <Link to="/analytics">Analytics</Link>
                </li>
              )}

              <li onClick={handleCloseNavbar}>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li onClick={handleCloseNavbar}>
                <Link to="/contact">Contact</Link>
              </li>

              {user ? (
                <ul>
                  <li onClick={handleCloseNavbar}>
                    <Link to="/my-profile">My Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li onClick={handleCloseNavbar}>
                    <Link to="/login">Login</Link>
                  </li>
                  <li onClick={handleCloseNavbar}>
                    <Link to="/register">Register</Link>
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

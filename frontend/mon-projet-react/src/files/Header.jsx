  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { LuSearch } from "react-icons/lu";
  import { BiShoppingBag } from "react-icons/bi";
  import { CiHeart } from "react-icons/ci";
  import { FiUser } from "react-icons/fi";
  import { RiCloseLargeLine } from "react-icons/ri";
  import { FaChevronDown } from "react-icons/fa";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "./Header.css";
  import { useLocation } from "react-router-dom";

  function Header() {
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);

    const handleButtonClick = (route) => {
      navigate(route);
    };

    const toggleSearch = () => {
      setSearchOpen(!searchOpen);
    };


      const location = useLocation();
    
      const user_name = location.state?.user_name || "";

    return (
      <div className="navbarcontainer">
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container">
            <a className="contact" href="#">{user_name}</a>
            
            <a 
              className="navbar-brand" 
              href="#" 
              onClick={() => handleButtonClick("/")}
            >
              Blancora
            </a>

            <div className="navbar-icons">
              {/* Icons grouped more tightly together */}
              <div className="icon-group">
             {/* Search button */}
{/* Search button */}
<div className="nav-icon-wrapper">
  <button 
    className="nav-icon-btn" 
    onClick={toggleSearch}
    aria-label="Search"
  >
    <LuSearch className="nav-icon" />
  </button>
  
  {searchOpen && (
    <div className="search-dropdown">
      <div className="search-header">
        <span>Search Products</span>
        <button onClick={toggleSearch}>
          <RiCloseLargeLine className="close-icon" />
        </button>
      </div>
      <div className="search-input-wrapper">
        <input 
          type="text" 
          placeholder="What are you looking for?" 
          autoFocus
          className="search-input"
        />
        <button className="search-btn">Search</button>
      </div>
    </div>
  )}
</div>



                {/* Cart Icon */}
                <div className="nav-icon-wrapper">
                  <button 
                    className="nav-icon-btn" 
                    aria-label="Shopping bag"
                  >
                    <BiShoppingBag className="nav-icon" />
                  </button>
                </div>

                {/* Wishlist Icon */}
                <div className="nav-icon-wrapper">
                  <button 
                    className="nav-icon-btn" 
                    onClick={() => handleButtonClick("/wishlist")}
                    aria-label="Wishlist"
                  >
                    <CiHeart className="nav-icon" />
                  </button>
                </div>

                {/* Account Icon */}
                <div className="nav-icon-wrapper">
                  <button 
                    className="nav-icon-btn" 
                    onClick={() => handleButtonClick("/registration")}
                    aria-label="User account"
                  >
                    <FiUser className="nav-icon" />
                  </button>
                </div>
              </div>

              {/* Favorite dropdown - now separate from other icons */}
              <div className="favorite-dropdown">
                <button 
                  className="favorite-dropdown-btn" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <span>Your Favorite</span>
                  <FaChevronDown className="dropdown-icon" />
                </button>
                
                <div className="dropdown-menu favorite-menu">
                  <div className="favorite-menu-content">
                    <h6 className="menu-section-title">Leagues</h6>
                    <div className="menu-section">
                      <a href="#" onClick={() => handleButtonClick("/english")} className="menu-item">
                        <img src={require("../assets/pl.png")} alt="Premier League" />
                        <span>PL</span>
                      </a>
                      
                      <a href="#" onClick={() => handleButtonClick("/spanish")} className="menu-item">
                        <img src={require("../assets/laliga.png")} alt="La Liga" />
                        <span>LaLiga</span>
                      </a>
                      
                      <a href="#" onClick={() => handleButtonClick("/italie")} className="menu-item">
                        <img src={require("../assets/sa.png")} alt="Serie A" />
                        <span>Serie A</span>
                      </a>
                      
                      <a href="#" onClick={() => handleButtonClick("/germain")} className="menu-item">
                        <img src={require("../assets/bl.png")} alt="Bundesliga" />
                        <span>Bundesliga</span>
                      </a>
                      
                      <a href="#" onClick={() => handleButtonClick("/france")} className="menu-item">
                        <img src={require("../assets/l1.png")} alt="Ligue 1" />
                        <span>Ligue 1</span>
                      </a>
                      
                      <a href="#" onClick={() => handleButtonClick("/other")} className="menu-item">
                        <img src={require("../assets/other.png")} alt="Other leagues" />
                        <span>Other </span>
                      </a>
                    </div>
                    
                    <h6 className="menu-section-title">Categories</h6>
                    <div className="menu-section">
                      <a href="#" className="menu-item" onClick={() => handleButtonClick("/Jackets")}>
                        <img src={require("../assets/jak.jpg")} alt="Jackets" />
                        <span>Jackets</span>
                      </a>
                      
                      <a href="#" className="menu-item" onClick={() => handleButtonClick("/Balls")}>
                        <img src={require("../assets/balllogo.png")} alt="Balls" />
                        <span>Balls</span>
                      </a>
                      <a href="#" className="menu-item" onClick={() => handleButtonClick("/Boots")}>
                        <img src={require("../assets/bt.jpg")} alt="Boots" />
                        <span>Boots</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  export default Header;
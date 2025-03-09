import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { FaBars } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { BiShoppingBag } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { RiCloseLargeLine } from "react-icons/ri";

import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header() {

  const navigate = useNavigate(); // Initialize the navigate function

  // Single handler to navigate to different routes
  const handleButtonClick = (route) => {
    navigate(route); // Navigate to the passed route
  };
  return (
    <>
      <div className="navbarcontainer">
        <nav className="navbar navbar-expand-lg bg-white fixed-top">
          <div className="container">

            <a className="contact text-dark nav-link" href="#">+ Contact Us</a>

            <a className="navbar-brand text-dark nav-link" href="#" onClick={() => handleButtonClick("/")}>Blancora</a>

            <div className="navbar-icons d-flex gap-3">
              <a className="nav-link text-dark" href="#"><BiShoppingBag /></a>
              <a className="nav-link text-dark" href="#" onClick={() => handleButtonClick("/registration")}><FiUser /></a>

              <div className="dropdown">
                <button className="btn menu-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <LuSearch />
                </button>
                <ul className="dropdown-menu search">
                  <li><a className="dropdown-item close" href="#"><RiCloseLargeLine /></a></li>
                  <li><a className="dropdown-item" href="#">
                    <div className="recherche">
                      <input type="text" placeholder="Search..."/>
                      <button>Cancel</button>
                    </div>
                  </a></li>
                </ul>
              </div>

              <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Your Favourite
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
  <a className="dropdown-item" href="#">
    Premier League 
    <img className="pl" src={require("../assets/pl.png")} alt="PL" />
  </a>
</li>
<li>
  <a className="dropdown-item" href="#">
    LALIGA 
    <img className="laliga" src={require("../assets/laliga.png")} alt="Laliga" />
  </a>
</li>
<li>
  <a className="dropdown-item" href="#">
    Serie A 
    <img className="sa" src={require("../assets/sa.png")} alt="Serie A" />
  </a>
</li>
<li>
  <a className="dropdown-item" href="#">
    Bundesliga 
    <img className="bl" src={require("../assets/bl.png")} alt="Bundesliga" />
  </a>
</li>
<li>
  <a className="dropdown-item" href="#">
    Ligue 1 
    <img className="l1" src={require("../assets/l1.png")} alt="Ligue 1" />
  </a>
</li>
<li>
  <a className="dropdown-item" href="#">
    Nike 
    <img className="nike" src={require("../assets/nike.png")} alt="nike" />
  </a>
</li>
<li>
  <a className="dropdown-item" href="#">
    Balls 
    <img className="balllogo" src={require("../assets/balllogo.png")} alt="balllogo" />
  </a>
</li>

                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      
    </>
  );
}

export default Header;
import { useState } from "react"
import { useAuth } from '../Context/Authcontext'
import styles from "./Navbar.module.css";
import logo from "../assets/vortexlogo.jpg";
import Games from "../ExplorePage/Games";
import { FaSearch } from "react-icons/fa";
import {
  useLocation,
  useNavigate
} from "react-router-dom";

function Navbar(){
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {isLoggedIn, logout} = useAuth();

    const searchResults = query.trim()==="" ? []
    : Games.filter((game) =>
      game.name.toLowerCase().includes(query.trim().toLowerCase()))

    const searchSlice = searchResults.slice(0,5);

    const handleLogin = () => {
      if(isLoggedIn){
        logout();
        navigate('/');
      }
      else navigate('/login');
    }

    return (
    <nav className={styles.navbar}>
      
      <div className={styles.logoSection}>
        <img className={styles.logo} src={logo} alt="Game Vortex logo" />
        <h1>Game Vortex</h1>
      </div>

      <ul className={styles.navLinks}>
        <li onClick={() => {
          setShowDropdown(false);
          setQuery("");
          navigate('/')
        }} 
        className={location.pathname==="/" ? styles.activeLink :styles.navLink}>DISCOVER</li>
        <li onClick={() => {
          setShowDropdown(false);
          setQuery("");
          navigate('/explore')
        }} 
        className={location.pathname==="/explore" ? styles.activeLink :styles.navLink}>EXPLORE</li>
        <li style={{
          visibility:
          isLoggedIn
          ? "visible"
          : "hidden"
          }}
          className={location.pathname==="/library" ? styles.activeLink :styles.navLink}
          onClick={() => navigate('/library')}>LIBRARY</li>
        <li style={{
          visibility:
          isLoggedIn
          ? "visible"
          : "hidden"
          }}
          className={location.pathname==="/wishlist" ? styles.activeLink :styles.navLink}
          onClick={() => navigate('/wishlist')}>WISHLIST</li>
      </ul>

      <div className={styles.searchContainer}>
        <input
        type="text"
        placeholder="Search the store"
        className={styles.searchInput}
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        onFocus={() =>
          setShowDropdown(true)
        }
        onBlur={() => {
          setTimeout(() => {
            setShowDropdown(false);
          }, 300);
        }}
        />
        <button
        className={styles.clearButton}
        onClick={() => {
            setQuery("");
            setShowDropdown(false);
        }}
        >
        ×
        </button>

        <button
        className={styles.searchButton}
        onClick={() => {
          const trimmed = query.trim();
          setShowDropdown(false);
          navigate(
             `/explore?query=${encodeURIComponent(trimmed)}`
          );
        }}
        >
        <FaSearch />
        </button>

        {showDropdown && searchResults.length > 0 && (
          <div className={styles.searchDropdown}>
            {searchSlice.map((game) => (
              <div
              key={game.appid}
              className={
                styles.searchItem
              }
              onClick={() => {
                setShowDropdown(false);
                setQuery("");
                navigate(`/game/${game.appid}`)
              }}
              >
                {game.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.navActions}>
        <button className={styles.cartButton} onClick={() => {
          if(isLoggedIn) navigate('/cart');
          else navigate('/signup');
        }}>
          {isLoggedIn?"Cart":"Signup"}
        </button>
        <button className={styles.accButton} onClick={handleLogin}>{isLoggedIn?"Logout":"Login"}</button>
      </div>

    </nav>
    );
}

export default Navbar
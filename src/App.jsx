import Home from './Homepage/Home.jsx'
import GamePage from './GamePage/Components/GamePage.jsx';
import Navbar from './Homepage/Navbar.jsx';
import ExplorePage from './ExplorePage/ExplorePage.jsx'
import LoginPage from './LoginPage/LoginPage.jsx';
import SignupPage from './SignupPage/SignupPage.jsx';
import WishlistPage from './Wishlist/WishlistPage.jsx';
import CartPage from './CartPage/CartPage.jsx';
import LibraryPage from './LibraryPage/LibraryPage.jsx';
import styles from './App.module.css'
import {
  Routes,
  Route
} from "react-router-dom";

function App(){
    return(
        <>
        <Navbar />
        <div className={styles.pageContainer}>
            <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/explore" element={<ExplorePage/>}/>
            <Route path="/game/:appId" element={<GamePage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/wishlist" element={<WishlistPage/>}/>
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/library" element={<LibraryPage/>}/>
        </Routes>
        </div>
        </>
    )
}

export default App
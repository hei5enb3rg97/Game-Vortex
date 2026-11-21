import styles from './WishlistPage.module.css'
import Games from "../ExplorePage/Games";
import { useAuth } from '../Context/Authcontext'; 
import {
   useEffect,
   useState
} from "react";
import {
    useNavigate
} from "react-router-dom";

function WishlistPage (){
    const [wishlist, setWishlist] = useState([]);
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuth();
    const username = authUser.username;
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            "http://localhost:8000/wishlist",
            {
                method: "GET",
                headers: {
                    "Authorization":
                    `Bearer ${token}`
                }
            }
        );
        
        const data = await response.json();
        
        if(response.ok){
            const ids = data.map((game) => game.game_id);
            const filteredGames =
                Games.filter(
                    (game) =>
                    ids.includes(
                        game.appid
                    )
                );
            setWishlist(filteredGames);
        }
        else{
            console.log(data.error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchWishlist();
    }, []);

    async function fetchGameStatus(gameId){
        const token = localStorage.getItem("token");
        if(!token) return;
        try{
            const response = await fetch(
                `http://localhost:8000/games/${gameId}/status`,
                {
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setStatus((prev) => ({...prev, [gameId]: data}));
            console.log(data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        if(wishlist.length === 0) return;
        wishlist.forEach((game) => {
            fetchGameStatus(game.appid);
        });
    }, [wishlist]);

    const handleRemove = async (gameId) => {
        const token = localStorage.getItem("token");
        
        const response = await fetch(
            `http://localhost:8000/wishlist/${gameId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization":
                    `Bearer ${token}`
                }
            }
        );
        
        const data = await response.json();
        
        if(response.ok){
            setWishlist(wishlist.filter((game) => game.appid!== gameId));
        }
        else{
            console.log(
                data.error
            );
        }
        fetchGameStatus(gameId);
    } 

    const handleCart = async (gameId) => {
        const token = localStorage.getItem("token");
        if(status[gameId]?.inCart){
            navigate(`/cart`);
            return;
        }
            const response = await fetch(
                "http://localhost:8000/cart/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appId: gameId
                    })
                }
            );
            const data = await response.json();
            if(!response.ok) {
                console.log(data.error);
            }
            else console.log("Added to Cart");
            fetchGameStatus(gameId);
        }
    
    const handleLibrary = async (gameId) => {
        const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:8000/library/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appId: gameId
                    })
                }
            );
            const data = await response.json();
            if(!response.ok) {
                console.log(data.error);
            }
            else{
                console.log("Added to Library");
                handleRemove(gameId);
            }
            fetchGameStatus(gameId);
        }

    if(loading){
        return <p>Loading...</p>;
    }
    
    return(
    <div className={styles.wishlistPage}>
        <h1 className={styles.wishlistHeader}> {username.toUpperCase()}'S WISHLIST</h1>
        {
            wishlist.length === 0? 
            (<h1>
                Your wishlist
                is empty
            </h1>): 
            (wishlist.map(
                (game) => 
                    (<div 
                        key={game.appid}
                        className={styles.wishlistRow}
                        onClick={()=> navigate(`/game/${game.appid}`)}
                    >
                        <img src={game.hero} alt="" className={styles.gameImage}/>
                        <div className={styles.gameInfo}>
                            <h2>{game.name}</h2>
                            <div className={styles.genreList}>
                                {game.genres.map((genre) => (
                                    <span
                                    key = {genre}
                                    className={styles.genreTag}
                                    >
                                        {genre}
                                    </span>
                            ))}</div>
                        </div>
                        
                        <div className={styles.gameActions}>
                            {game.price!=="Free to Play" && <span className={styles.gamePrice}>{game.price}</span>}
                            <button className={styles.cartButton} onClick={(e) => {
                                e.stopPropagation();
                                game.numPrice? handleCart(game.appid):handleLibrary(game.appid);
                            }}>
                                {game.price==="Free to Play"?(status[game.appid]?.inLibrary?"In Library":"Add to Library"):(status[game.appid]?.inCart?"In Cart":"Add to Cart") }
                            </button>
                            <button className={styles.removeButton} onClick={(e) => {e.stopPropagation(); handleRemove(game.appid)}}>Remove</button>
                        </div>
                    </div>
                    )
                )
            )
        }
    </div>);
}

export default WishlistPage
import styles from './CartPage.module.css'
import Games from "../ExplorePage/Games";
import { useAuth } from '../Context/Authcontext'; 
import {
    useNavigate
} from "react-router-dom";
import {
   useEffect,
   useState
} from "react";

function CartPage (){
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuth();
    const username = authUser?.username || "PLAYER";
    const navigate = useNavigate();

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            "http://localhost:8000/Cart",
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
            setCart(filteredGames);
        }
        else{
            console.log(data.error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (gameId) => {
        const token = localStorage.getItem("token");
        
        const response = await fetch(
            `http://localhost:8000/Cart/${gameId}`,
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
            setCart(cart.filter((game) => game.appid!== gameId));
        }
        else{
            console.log(
                data.error
            );
        }
    } 

    const checkout = async () => {
        const token = localStorage.getItem("token");
        try {
            const response =
            await fetch(
                "http://localhost:8000/checkout",
                {
                    method: "POST",
                    headers: {
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );
            
            const data = await response.json();
            
            if(data.success){
                alert("Purchase Successful");
                navigate("/library");
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const total = cart.reduce((sum, game) => {
        return (sum + game.numPrice);
    }, 0);

    if(loading){
        return <p>Loading...</p>;
    }
    
    return(<div className={styles.cartLayout}>
        <div className={styles.cartPage}>
        <h1 className={styles.cartHeader}> {username.toUpperCase()}'S CART</h1>
        {
            cart.length === 0? 
            (<h1>
                Your Cart
                is empty
            </h1>): 
            (cart.map(
                (game) => 
                    (<div 
                        key={game.appid}
                        className={styles.cartRow}
                        onClick={() => navigate(`/game/${game.appid}`)}
                    >
                        <img src={game.hero} alt="" className={styles.gameImage}/>
                        <div className={styles.gameInfo}>
                            <h2>{game.name}</h2>
                            <div className={styles.gameActions}>
                            {game.price!=="Free to Play" && <span className={styles.gamePrice}>{game.price}</span>}
                            <button className={styles.removeButton} onClick={(e) => {e.stopPropagation(); handleRemove(game.appid)}}>Remove</button>
                        </div>
                        </div>
                    </div>
                    )
                )
            )
        }
    </div>
    
    {cart.length > 0 &&
    <div className={styles.summaryCard}>
        <h2>Order Summary</h2>
        <div className={styles.summaryRow}>
            <span>Items</span>
            <span>{cart.length}</span>
        </div>

        <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹ {total.toLocaleString()}</span>
        </div>

        <div className={styles.summaryRow}>
            <span>Platform Fee</span>
            <span>₹ 0</span>
        </div>

        <hr />

        <div className={styles.totalRow}>
            <span>Total</span>
            <span>₹ {total.toLocaleString()}</span>
        </div>

        <button className={styles.checkoutButton} onClick={checkout}>
            Proceed to Checkout
        </button>

    </div>
    }

    </div>);
}

export default CartPage
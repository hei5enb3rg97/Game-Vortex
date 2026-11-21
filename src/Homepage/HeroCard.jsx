import styles from "./HeroCard.module.css";
import {
  useNavigate
} from "react-router-dom";


function HeroCard({title, badge, genre, description, rating, status, price, image, appId}) {
    
    const navigate = useNavigate();

    return (
    <div className={styles.heroCard} onClick={() => navigate(`/game/${appId}`)}>
      
      <img 
        className={styles.gameImage}
        src={image}
        alt={title}
      />
      
      <div className={styles.overlay}>
        <span className={styles.badge}>{badge}</span>
        <h2>{title}</h2>
        <p className={styles.genre}>
            {genre}
        </p>
        <p>
            {description}
        </p>
        <p className={styles.meta}>
            {rating} • {status}
        </p>
        <div className={styles.actions}>
            <button>Buy Now</button> &nbsp;
            <span>{price}</span><br/>
            <button>Details</button>
        </div>
      </div>

    </div>
    );

}

export default HeroCard
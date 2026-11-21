import styles from "./GameCard.module.css";
import { useState, useEffect } from 'react'
import {
  useNavigate
} from "react-router-dom";

function GameCard({ title, appId, price ,image}) {
  const navigate =
    useNavigate();

  const openGame = () => {
    navigate(
      `/game/${appId}`
    );
  };

  return (
    <div className={styles.gameCard} onClick={openGame}>
      <img
        src={image}
        alt={title}
        loading="lazy"
        className={styles.gameImage}
      />
      <p className={styles.priceTag}>{price}</p>

    </div>
  );
}

export default GameCard;
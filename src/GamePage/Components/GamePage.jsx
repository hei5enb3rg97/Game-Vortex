import { useEffect, useState } from "react";
import styles from './GamePage.module.css'
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp } from "react-icons/fa"
import {
  useParams
} from "react-router-dom";
import {
  useNavigate
} from "react-router-dom";

function GamePage({ selectedAppid = null }) {
    const [game, setGame] = useState(null);
    const [index, setIndex] = useState(0);
    const [expand, setExpand ] = useState(false);
    const [status, setStatus] = useState({
        inLibrary: false,
        installed: false,
        inWishlist: false,
        inCart: false,
        totalPlaytime: 0,
        recentPlaytime: 0,
        lastPlayed: "Never"
    });
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    let { appId } = useParams();
    if(!appId) appId = selectedAppid;
    const isLibraryView =
        selectedAppid !== null;

    async function fetchGameStatus(){
        if(!token) return;
        try{
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/games/${appId}/status`,
                {
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setStatus(data);
            console.log(data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchGameStatus();
    }, [appId]);

    const [current, setCurrent] = useState(0);

    useEffect(() => {
    fetch(
        `${import.meta.env.VITE_API_URL}/steam/appdetails/${appId}`
    )
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch game details");
        }
        return response.json();
    })
    .then((data) => {
        const game = data[appId].data;
        setGame(game);
    })
    .catch((error) => {
        console.error("Game details error:", error);
    });
}, [appId]);

    if(game){
        const media = [
            ...(game.movies || []).map((movies) => ({
                type: "video",
                thumb: movies.thumbnail,
                src: movies.hls_h264
            })),
            ...(game.screenshots || []).map((shot) => ({
                type: "image",
                thumb: shot.path_thumbnail,
                src: shot.path_full
            }))
        ];

        const currentMedia = media[current]||media[0];

        const nextSlide = () => {
            setIndex((prev) => {
                if(prev + 1 > Math.max(0,media.length-1)/6) return 0;
                return prev + 1;
            });
        }
        
        const prevSlide = () => {
            setIndex((prev) => {
                if(prev - 1 < 0) return Math.floor(Math.max(0,media.length-1)/6);
                return prev - 1;
            });
        }

        const updateCurrent = (realIndex) => {
            setCurrent(realIndex);
        }

        const handleWish = async () => {
            if(!token){
                navigate('/login');
                return;
            }
            if(status.inWishlist){
                navigate('/wishlist');
                return;
            }
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/wishlist/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appId
                    })
                }
            );
            const data = await response.json();
            if(!response.ok) {
                console.log(data.error);
            }
            else console.log("Added to Wishlist");
            await fetchGameStatus();
        }

        const handleCart = async () => {
            if(!token){
                navigate('/login');
                return;
            }
            if(status.inCart||status.inLibrary){
                navigate('/cart');
                return;
            }
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/cart/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appId
                    })
                }
            );
            const data = await response.json();
            if(!response.ok) {
                console.log(data.error);
            }
            else console.log("Added to Cart");
            await fetchGameStatus();
        }

        const handleLibrary = async () => {
            if(!token){
                navigate('/login');
                return;
            }
            if(status.inLibrary){
                navigate('/library');
                return;
            }
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/library/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appId
                    })
                }
            );
            const data = await response.json();
            if(!response.ok) {
                console.log(data.error);
            }
            else console.log("Added to Library");
            await handleRemoveWishlist();
            await fetchGameStatus();
        }

        const toggleInstall = async () => {
            try{
                await fetch(`${import.meta.env.VITE_API_URL}/library/${appId}/install`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization":
                            `Bearer ${token}`
                        }
                    }
                );
                await fetchGameStatus();
            }
            
            catch(error){
                console.log(error);
            }
        }

        const handleRemoveWishlist = async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/wishlist/${appId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization":
                        `Bearer ${token}`
                    }
                }
            );
            
            const data = await response.json();
            
            if(!response.ok){
                console.log(
                    data.error
                );
            }
        }

        return (
            <div className={styles.gamePage}>
                <div className={styles.gameContainer}>
                    <h1>{game.name}</h1>
                    <div className={styles.topSection}>
                        <div className={styles.mediaSection}>
                            <div className={styles.mediaDisplay}>
                                {
                                    currentMedia.type === "video" ? (
                                    <video
                                    key={currentMedia.src}
                                    src={currentMedia.src}
                                    controls
                                    autoPlay
                                    muted
                                    />
                                    ) : (
                                    <img
                                    key={currentMedia.src}
                                    src={currentMedia.src}
                                    alt=""
                                    />
                                )}
                            </div>
                            <div className={styles.mediaSlider}>
                                <button className={styles.leftSlide} onClick={prevSlide}>
                                    <FaChevronLeft />
                                </button>
                                <div className={styles.thumbViewport}>
                                    <div className={styles.thumbTrack}
                                    style={{
                                        transform:
                                        `translateX(-${index * 801}px)`
                                    }}
                                    >
                                    {media.map((item, i) => (
                                        <div
                                        key={i}
                                        className={`${styles.thumbWrapper} ${(current===i) ? styles.activeThumb:""}`}
                                        onClick= {() => updateCurrent(i)}
                                        >
                                            <img src={item.thumb} alt="" />
                                            {item.type === "video" && (<span className={styles.playIcon}>▶</span>)}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                <button className={styles.rightSlide} onClick={nextSlide}>
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                        <div className={styles.infoSection}>
                            <img src= {game.header_image} className={styles.headerImage}></img>
                            <p className={styles.description}>{game.short_description}</p>
                            <div className={styles.metaSection}>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}>Release:</span>
                                    <span className={styles.metaValue}>
                                        {game.release_date?.date}
                                    </span>
                                </div>
                                
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}>Developer:</span>
                                    <span className={styles.metaValue}>
                                        {game.developers?.join(", ")}
                                    </span>
                                </div>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}>Publisher:</span>
                                    <span className={styles.metaValue}>
                                        {game.publishers?.join(", ")}
                                    </span>
                                </div>
                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}>Genres:</span>
                                    <div className={styles.genreList}>
                                        {game.genres?.map((genre) => (
                                            <span
                                            key={genre.id}
                                            className={styles.genreTag}
                                            >
                                                {genre.description}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {isLibraryView && 
                            <div className={styles.libraryInfoSection}>
                                <div className={styles.libraryStats}>
                                    <p>
                                        <span>Playtime:</span>
                                        {" "}{status.totalPlaytime || 0} hrs
                                    </p>
                                    <p>
                                        <span>Last played:</span>
                                        {" "}
                                        {status.lastPlayed || "Never"}
                                    </p>
                                </div>
                                
                                <div className={styles.libraryActions}>
                                    {
                                    status.installed ? (<>
                                    <button className={styles.playButton}>
                                        Play
                                    </button>
                                    <button className={styles.uninstallButton} onClick={toggleInstall}>
                                        Uninstall
                                    </button>
                                    </>) : 
                                    (
                                    <button className={styles.installButton} onClick={toggleInstall}>
                                        Install
                                    </button>
                                    )
                                    }
                                </div>
                            </div>}

                        </div>
                    </div>
                </div>

                {!isLibraryView &&
                <div className={styles.purchaseSection}>
                    <h2 className={styles.purchaseTitle}>
                        Buy {game.name}
                    </h2>
                    <div className={styles.purchaseActions}>
                        <span className={styles.gamePrice}>
                            {game.is_free
                            ? "Free to Play"
                            : game.price_overview?.final_formatted||"Free to Play"}
                        </span>
                        {!status.inLibrary &&
                        <button className={styles.wishButton} onClick={handleWish}>
                            {status.inWishlist?"On Wishlist":"Add to Wishlist"}
                        </button>}
                        <button className={styles.cartButton} onClick={() => {
                            {game.is_free?handleLibrary():handleCart()}
                        }}>
                            {status.inLibrary?"In Library":(game.is_free?"Add to Library":(status.inCart?"In Cart":"Add to Cart"))}
                        </button>
                    </div>
                </div>
                }

                <button onClick={() => setExpand((prev)=>!prev)}
                    className={styles.expandButton}> {expand?"show less":"show more"}
                    {expand?<FaChevronUp className={styles.showup}/>:<FaChevronDown className={styles.showdown}/>}
                </button>

                {expand &&
                <div className={styles.aboutSection}>
                    <h2>About This Game</h2>
                    <div dangerouslySetInnerHTML={{
                        __html: game.detailed_description
                    }} className={styles.details}/>
                </div>}
                
                {expand &&
                <div className={styles.requirementsSection}>
                    <h2>System Requirements</h2>
                    <div className={styles.requirementsGrid}>
                        <div className={styles.specBox}>
                            <div
                            dangerouslySetInnerHTML={{
                                __html: game.pc_requirements?.minimum || "Not available"
                            }}
                            />
                        </div>
                        <div className={styles.specBox}>
                            <div
                            dangerouslySetInnerHTML={{
                                __html: game.pc_requirements?.recommended || "Not available"
                            }}
                            />
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
    else return(<p>loading</p>);
}

export default GamePage;
import rdr2Image from "../assets/hero/rdr2.jpg";
import witcher3Image from "../assets/hero/witcher3.jpg";
import tlou2Image from "../assets/hero/tlou2.jpg";
import expedition33Image from "../assets/hero/expedition33.jpg";
import marvelRivalsImage from "../assets/hero/rivals.jpg";
import cs2Image from "../assets/hero/cs2.jpg";
import silksongImage from "../assets/hero/silksong.jpg";

const featuredGames = [
  {
    title: "Red Dead Redemption 2",
    badge: "CLASSIC",
    genre: "Action • Open World • Story",
    description: "Survive the dying days of the Wild West.",
    rating: "4.9",

    status: "30% OFF",
    price: "$39.99",

    image: rdr2Image,

    appId: 1174180
  },

  {
    title: "The Witcher 3",
    badge: "LEGENDARY",
    genre: "RPG • Open World • Fantasy",
    description: "Hunt monsters and shape a war-torn world.",
    rating: "4.8",

    status: "50% OFF",
    price: "$29.99",

    image: witcher3Image,

    appId: 292030
  },

  {
    title: "The Last of Us Part II",
    badge: "CRITIC'S PICK",
    genre: "Action • Survival • Story",
    description: "Endure a brutal journey of revenge and loss.",
    rating: "4.7",

    status: "25% OFF",
    price: "$49.99",

    image: tlou2Image,

    appId: 2531310
  },

  {
    title: "Clair Obscur: Expedition 33",
    badge: "NEW RELEASE",
    genre: "RPG • Turn-Based • Fantasy",
    description: "Lead the expedition and break the cycle.",
    rating: "4.8",

    status: "20% OFF",
    price: "$59.99",

    image: expedition33Image,

    appId: 1903340
  },

  {
    title: "Marvel Rivals",
    badge: "TRENDING",
    genre: "Hero Shooter • Multiplayer • PvP",
    description: "Assemble iconic heroes and dominate the battlefield.",
    rating: "4.6",

    status: "Free to Play",
    price: "Free",

    image: marvelRivalsImage,

    appId: 2767030
  },

  {
    title: "Counter-Strike 2",
    badge: "TOP PLAYED",
    genre: "FPS • Tactical • Competitive",
    description: "Precision, teamwork, and split-second decisions.",
    rating: "4.8",

    status: "Free to Play",
    price: "Free",

    image: cs2Image,

    appId: 730
  },

  {
    title: "Hollow Knight: Silksong",
    badge: "MOST WANTED",
    genre: "Metroidvania • Action • Indie",
    description: "Journey through a haunted kingdom as Hornet.",
    rating: "4.9",

    status: "COMING SOON",
    price: "TBA",

    image: silksongImage,

    appId: 1030300
  }
];

export default featuredGames;
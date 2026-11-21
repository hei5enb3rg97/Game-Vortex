import Games from "../ExplorePage/Games";

const topSellerIds = [
    1174180,
    1091500,
    1245620,
    292030,
    1086940,
    271590,
    582010,
    814380,
    374320,
    990080,
    2050650,
    1693980,
    1551360,
    1778820,
    1364780,
    2344520,
    1888160,
    1716740,
    1627720
];

const frequentlyPurchased = Games.filter(
    game => topSellerIds.includes(game.appid)
);

export default frequentlyPurchased;
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import db from './db.js'
import dotenv from "dotenv";

import Games from '../src/ExplorePage/Games.js'
const app = express()
const PORT = process.env.PORT||8383

dotenv.config();

async function createUsersTable() {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`
        );
        console.log("Users table ready");
    }

    catch(err) {
        console.log(err.message);
    }
}

async function createWishlistTable() {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS wishlist (
            user_id INTEGER
            REFERENCES users(id)
            ON DELETE CASCADE,
            game_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, game_id)
            )`
        );
        console.log("Wishlist ready");
    }

    catch(err) {
        console.log(err.message);
    }
}

async function createCartTable() {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS cart (
            user_id INTEGER
            REFERENCES users(id)
            ON DELETE CASCADE,
            game_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, game_id)
            )`
        );
        console.log("Cart ready");
    }

    catch(err) {
        console.log(err.message);
    }
}

async function createLibraryTable() {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS library (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            game_id INT NOT NULL,
            installed BOOLEAN DEFAULT FALSE,
            total_playtime REAL DEFAULT 0,
            recent_playtime REAL DEFAULT 0,
            last_played TIMESTAMP NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
            UNIQUE(user_id, game_id)
            )`
        );
        console.log("Library ready");
    }

    catch(err) {
        console.log(err.message);
    }
}

async function createOrdersTable() {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            
            user_id INTEGER
            REFERENCES users(id)
            ON DELETE CASCADE,
            total INTEGER NOT NULL,
            created_at TIMESTAMP
            DEFAULT NOW()
            )`
        );
        console.log("Orders ready");
    }

    catch(err) {
        console.log(err.message);
    }
}

async function createOrderItemsTable() {
    try {
        await db.query(
            `CREATE TABLE IF NOT EXISTS order_items(
            order_id INTEGER
            REFERENCES orders(id)
            ON DELETE CASCADE,
            game_id BIGINT NOT NULL,
            price INTEGER NOT NULL
            )`
        );
        console.log("Order Items ready");
    }

    catch(err) {
        console.log(err.message);
    }
}


async function startServer() {
    try {
        await createUsersTable();
        await createWishlistTable();
        await createCartTable();
        await createLibraryTable();
        await createOrdersTable();
        await createOrderItemsTable();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server initialization failed:", error);
        process.exit(1);
    }
}

startServer();

app.use(cors());
app.use(express.json());


app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            `INSERT INTO users(username, email, password)
            VALUES ($1, $2, $3)`,
            [username, email, hashedPassword]
        );

        res.json({
            message: "User created"
        });
    }

    catch(err) {
        if (err.code === "23505") {
            return res.status(400).json({
                error: "Email already exists"
            });
        }
        res.status(400).json({
            error: err.message
        });
    }
});

app.post("/wishlist/add", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                error: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const { appId } = req.body;

        await db.query(`
            INSERT INTO wishlist(user_id, game_id)
            VALUES ($1, $2)`,
            [userId, appId]
        );

        res.json({
            message: "game added to wishlist"
        });
    }

    catch(err) {
        res.status(400).json({
            error: err.message
        });
    }
});

app.delete("/wishlist/:gameId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: "No token"});
        }
        
        const token = authHeader.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        const gameId = req.params.gameId;
        
        await db.query(`
                DELETE FROM wishlist
                WHERE user_id = $1
                AND
                game_id = $2`,
                [userId, gameId]
            );

            res.json({
                message:
                "Removed"
            });
        }

        catch(err){
            res.status(
                400
            ).json({
                error:
                err.message
            });
        }
    }
);

app.post("/cart/add", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                error: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const { appId } = req.body;

        await db.query(`
            INSERT INTO cart(user_id, game_id)
            VALUES ($1, $2)`,
            [userId, appId]
        );

        res.json({
            message: "game added to cart"
        });
    }

    catch(err) {
        res.status(400).json({
            error: err.message
        });
    }
});

app.delete("/cart/:gameId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: "No token"});
        }
        
        const token = authHeader.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        const gameId = req.params.gameId;
        
        await db.query(`
                DELETE FROM cart
                WHERE user_id = $1
                AND
                game_id = $2`,
                [userId, gameId]
            );

            res.json({
                message:
                "Removed"
            });
        }

        catch(err){
            res.status(
                400
            ).json({
                error:
                err.message
            });
        }
    }
);

app.post("/library/add", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                error: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const { appId } = req.body;

        await db.query(`
            INSERT INTO library(user_id, game_id)
            VALUES ($1, $2)`,
            [userId, appId]
        );

        res.json({
            message: "game added to library"
        });
    }

    catch(err) {
        res.status(400).json({
            error: err.message
        });
    }
});

app.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        const result = await db.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]
        );

        if(result.rows.length === 0) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if(!isMatch) {
            return res.status(400).json({
                error: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.json({
            token
        });
    }

    catch(err) {
        res.status(500).json({
            error: err.message
        });
    }

});

app.get("/wishlist", async (req,res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(
                401
            ).json({
                error:
                "No token"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const result = await db.query(`
            SELECT game_id FROM wishlist
            WHERE user_id = $1`,
            [userId]
        );
        
        res.json(
            result.rows
        );
    }
    
    catch(err){
        res.status(401).json({
            error:
            err.message
        });
    }
}
);

app.get("/cart", async (req,res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(
                401
            ).json({
                error:
                "No token"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const result = await db.query(`
            SELECT game_id FROM cart
            WHERE user_id = $1`,
            [userId]
        );
        
        res.json(
            result.rows
        );
    }
    
    catch(err){
        res.status(401).json({
            error:
            err.message
        });
    }
}
);

app.get("/library", async (req,res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(
                401
            ).json({
                error:
                "No token"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const result = await db.query(`
            SELECT game_id FROM library
            WHERE user_id = $1`,
            [userId]
        );
        
        res.json(
            result.rows
        );
    }
    
    catch(err){
        res.status(401).json({
            error:
            err.message
        });
    }
}
);

app.get("/games/:appid/status", async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(
                401
            ).json({
                error:
                "No token"
            });
        }
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const appid = req.params.appid;
        
        const libraryResult = await db.query(
            `SELECT installed,
                    total_playtime,
                    recent_playtime,
                    last_played
            FROM library
            WHERE user_id = $1
            AND game_id = $2`,
            [userId, appid]
        );

        const wishlistResult = await db.query(
            `SELECT 1 FROM wishlist
            WHERE user_id = $1
            AND game_id = $2`,
            [userId, appid]
        );

        const cartResult = await db.query(
            `SELECT 1 FROM cart
            WHERE user_id = $1
            AND game_id = $2`,
            [userId, appid]
        );

        const inLibrary = libraryResult.rows.length > 0;

        const status = {
            inLibrary,
            installed: inLibrary? libraryResult.rows[0].installed: false,
            inWishlist: wishlistResult.rows.length > 0,
            inCart: cartResult.rows.length > 0,
            totalPlaytime: inLibrary? libraryResult.rows[0].total_playtime: 0,
            recentPlaytime: inLibrary? libraryResult.rows[0].recent_playtime: 0,
            lastPlayed: inLibrary? libraryResult.rows[0].last_played: null
        };
        
        res.json(status);
    }
    
    catch(error){
        console.log(error);

        res.status(500).json({
            error:
            "Failed to fetch game status"
        });
    }}
);

app.put("/library/:appid/install", async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                error: "No token"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const appid = req.params.appid;

        const result =
            await db.query(
                `SELECT installed
                 FROM library
                 WHERE user_id = $1
                 AND game_id = $2`,
                [userId, appid]
            );

        if(result.rows.length === 0){
            return res.status(404).json({
                error: "Game not in library"
            });
        }

        const currentInstalled = result.rows[0].installed;
        const newInstalled = !currentInstalled;

        await db.query(
            `UPDATE library
             SET installed = $1
             WHERE user_id = $2
             AND game_id = $3`,
            [newInstalled, userId, appid]
        );

        res.json({
            installed: newInstalled
        });
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/grid/:appid", async (req, res) => {
    try {
        const appid = req.params.appid;
        const response = await fetch(
            `https://www.steamgriddb.com/api/v2/icons/steam/${req.params.appid}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.STEAMGRIDDB_API_KEY}`
                }
            }
        );
        const data = await response.json();
        console.log(data);
        res.json({
            image: data.data?.[0]?.url || null
        });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            error: "Failed to fetch grid"
        });
    }
});

app.post("/checkout", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                error: "No token"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const cartResult =
        await db.query(
            `
            SELECT *
            FROM cart
            WHERE user_id = $1
            `,
            [userId]
        );

        const cartGames = cartResult.rows;

        let total = 0;
        for(const cartGame of cartGames){
            const game =
            Games.find(
                game =>
                game.appid === cartGame.game_id
            );

            if(game){
                total += game.numPrice;
            }
        }

        const orderResult =
        await db.query(
            `
            INSERT INTO orders(
                user_id,
                total
            )
            VALUES($1, $2)
            RETURNING id
            `,
            [userId, total]
        );

        const orderId = orderResult.rows[0].id;

        for(const cartGame of cartGames){

            const game =
            Games.find(
                game =>
                game.appid === cartGame.game_id
            );

            if(!game) continue;

            await db.query(
                `
                INSERT INTO library(
                    user_id,
                    game_id
                )
                VALUES($1, $2)
                ON CONFLICT DO NOTHING
                `,
                [userId, game.appid]
            );

            await db.query(
                `
                INSERT INTO order_items(
                    order_id,
                    game_id,
                    price
                )
                VALUES($1, $2, $3)
                `,
                [orderId, game.appid, game.numPrice]
            );

            await db.query(
                `
                DELETE FROM wishlist
                WHERE user_id = $1
                AND game_id = $2
                `,
                [userId, game.appid]
            );
        }

        await db.query(
            `
            DELETE FROM cart
            WHERE user_id = $1
            `,
            [userId]
        );

        res.json({
            success: true
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error: "Checkout failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`server has started on PORT:${PORT}`)
})

import styles from './LoginPage.module.css'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/Authcontext';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if(response.ok) {
            login(data.token);
            navigate("/");
        }
        else {
            console.log(data.error);
            alert(data.error);
        }
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <h1>Welcome Back</h1>
                <p>Sign in to continue to Game Vortex</p>

                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.authInput}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.authInput}
                />

                <button className={styles.authButton} onClick={handleLogin}>
                    Login
                </button>

                <p className={styles.switchText}>
                    Don't have an account? {" "}
                    <span
                        className={styles.switchLink}
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage
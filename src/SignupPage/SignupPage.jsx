import { useState } from 'react';
import styles from './SignupPage.module.css';
import { useNavigate } from 'react-router-dom';
import { SiDatadotai } from 'react-icons/si';

function SignupPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("Signup handler started");
        if(password !== confirmPassword) {
            console.log("Passwords do not match");
            alert("Passwords do not match");
            return;
        }

        const response = await fetch(
            "http://localhost:8000/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if(response.ok) {
            navigate('/login');
        }
        else {
            console.log(data.error);
            alert(data.error);
        }
    };

    return (
        <div className={styles.authPage}>
            <form className={styles.authCard} onSubmit={handleSignup}>
                <h1>Create Account</h1>
                <p>Join Game Vortex and start building your library</p>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className={styles.authInput}
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={styles.authInput}
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={styles.authInput}
                />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className={styles.authInput}
                />

                <button type="submit" className={styles.authButton} onClick={handleSignup}>
                    Create Account
                </button>

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <span
                        className={styles.switchLink}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}

export default SignupPage;

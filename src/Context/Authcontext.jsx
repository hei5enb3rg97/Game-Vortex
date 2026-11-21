import { 
    createContext,
    useContext, 
    useState 
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider(props) {

    const savedToken = localStorage.getItem("token");
    const [authUser,setAuthUser] = useState(
        savedToken? {
            userId: jwtDecode(savedToken).userId,
            username:jwtDecode(savedToken).username
        }
        : null
    );
    const isLoggedIn = !!authUser;

    function login(token) {
        localStorage.setItem(
            "token",
            token
        );
        const decoded = jwtDecode(token);
        setAuthUser({username:decoded.username, userId:decoded.userId});
    }

    function logout() {
        localStorage.removeItem(
            "token"
        );
        setAuthUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                authUser,
                login,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

// src/context/userAuthContext.tsx
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react"; // Added ReactNode
import { auth } from "../firebaseConfig"; // Ensure this path is correct

interface IUserAuthProviderProps {
    children: ReactNode; // Use ReactNode for children prop
}

// Define the shape of your context data
type AuthContextData = {
    user: User | null;
    loadingAuth: boolean; // New loading state
    logIn: (email: string, password: string) => Promise<any>; // Explicitly typed for clarity
    signUp: (email: string, password: string) => Promise<any>;
    logOut: () => Promise<void>;
    googleSignIn: () => Promise<any>;
};

// Authentication functions
const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email: string, password: string) => {
    // Return the promise for better handling in components
    return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
    // Return the promise
    return signOut(auth);
};

const googleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
};

// Create the context with a default value
export const userAuthContext = createContext<AuthContextData>({
    user: null,
    loadingAuth: true, // Initialize loadingAuth to true
    logIn,
    signUp,
    logOut,
    googleSignIn,
});

// Corrected Provider name: UserAuthProvider
export const UserAuthProvider: React.FunctionComponent<IUserAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true); // State for loading authentication status

    useEffect(() => {
        setLoadingAuth(true); // Set loading to true when the effect runs/auth state might change
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("Auth state changed: User is logged in", currentUser.uid);
                setUser(currentUser);
            } else {
                console.log("Auth state changed: User is logged out");
                setUser(null); // Ensure user is set to null on logout
            }
            setLoadingAuth(false); // Set loading to false once auth state is determined
        });

        // Cleanup subscription on unmount
        return () => {
            console.log("Unsubscribing from onAuthStateChanged");
            unsubscribe();
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

    const value: AuthContextData = {
        user,
        loadingAuth, // Provide loadingAuth state
        logIn,
        signUp,
        logOut,
        googleSignIn,
    };

    return <userAuthContext.Provider value={value}>{children}</userAuthContext.Provider>;
};

// Custom hook to use the auth context
export const useUserAuth = () => {
    const context = useContext(userAuthContext);
    if (context === undefined) {
        // This error is helpful if the hook is used outside of the provider
        throw new Error("useUserAuth must be used within a UserAuthProvider");
    }
    return context;
};
import { createContext, useEffect, useReducer } from 'react';
import AuthReducer from './AuthReducer';

const INITIAL_STATE = {
    currentUser: null
};

// Safely parse the localStorage data
const userFromStorage = localStorage.getItem('user');
if (userFromStorage !== null) {
    try {
        INITIAL_STATE.currentUser = JSON.parse(userFromStorage);
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        INITIAL_STATE.currentUser = null;
    }
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        // localStorage.setItem('user', JSON.stringify(state.currentUser));
    }, [state.currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

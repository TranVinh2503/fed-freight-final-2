import { createContext } from 'react';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({
        id:'',
        user:'',
        role:''
    });

    function getUserFromToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            // console.log(decodedToken);
            return decodedToken;
        } catch (error) {
            if (error.name === 'InvalidTokenError') {
                console.log('Invalid token specified');
            } else {
                console.log('Error decoding token:', error.message);
            }
        }
    }

    useEffect(() => {
        const UserFromToken = localStorage.getItem('access-token');
        setUser(getUserFromToken(UserFromToken));
    }, []);

    return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
};

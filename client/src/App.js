import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routes';
import { DefaultLayout } from '~/components/Layouts';
import { Fragment } from 'react';
import jwtDecode from 'jwt-decode';
import { useState, useEffect } from 'react';
import { AppProvider } from './Context/AppContext';

function App() {
    const [userName, setUserName] = useState('');
    function getUsernameFromToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.user;
        } catch (error) {
            if (error.name === 'InvalidTokenError') {
                console.log('Invalid token specified');
            } else {
                console.log('Error decoding token:', error.message);
            }
        }
    }

    useEffect(() => {
        const userName = localStorage.getItem('access-token');
        setUserName(getUsernameFromToken(userName));
    }, []);

    return (
        <AppProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;

                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;

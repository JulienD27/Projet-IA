import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Admin from "./Components/Admin";
import Student from "./Components/Student";
import NavBar from "./Utils/NavBar";
import './App.css';
import LoginForm from "./Components/loginForm";
import React, {useEffect} from "react";

function App() {
    const [isConnected, setConnected] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [user, setUser] = React.useState({
        username: '',
        password: '',
        studentId: '',
        userId: '',
    });

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        console.log('loggedInUser from App : ' + loggedInUser);
        /*if (loggedInUser) {
            console.log('loggedInUser from App : ' + loggedInUser);
            user.username = JSON.parse(loggedInUser).username;
            user.password = JSON.parse(loggedInUser).password;
            user.studentId = JSON.parse(loggedInUser).studentId;
            console.log('student id from App : ' + user.studentId)
            user.userId = JSON.parse(loggedInUser).userId;
            console.log('user from App : ' + user)
            if (loggedInUser.studentId === null || loggedInUser.studentId === "null" || loggedInUser.studentId === "" || loggedInUser.studentId === undefined || isNaN(loggedInUser.studentId)
             || isNaN(user.studentId)){
                setIsAdmin(true)
                console.log('isAdmin from App : ' + isAdmin)
            }
            else{
                setIsAdmin(false)
                console.log('isAdmin from App : ' + isAdmin)
            }
            setConnected(true);
            console.log(user);
            console.log("Is connected ? " + isConnected);
            console.log("Is admin ? " + isAdmin);
        }*/
        if (loggedInUser) {
            //setUser(loggedInUser);
            setConnected(true);
            console.log('loggedInUser.studentId from App : ' + JSON.parse(loggedInUser).studentId)
            if (JSON.parse(loggedInUser).studentId !== null) {
                // Si l'ID de l'étudiant existe, considérez l'utilisateur comme un étudiant
                console.log('setIsAdmin(false)')
                setIsAdmin(false);
            } else {
                // Sinon, considérez-le comme un administrateur
                console.log('setIsAdmin(true)')
                setIsAdmin(true);
            }
        }
    } , []);

    return (
        <Router>
            <div>
                <NavBar isConnected={isConnected} setConnected={setConnected} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isConnected ? (
                                <Navigate to={isAdmin ? '/Admin' : '/Student'} />
                            ) : (
                                <LoginForm
                                    isAdmin={isAdmin}
                                    setIsAdmin={setIsAdmin}
                                    isConnected={isConnected}
                                    setConnected={setConnected}
                                    setUser={setUser}
                                    user={user}
                                />
                            )
                        }
                    />
                    <Route
                        path="/Student"
                        element={isConnected && !isAdmin ? <Student user={user} setUser={setUser} isConnected={isConnected} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/Admin"
                        element={isConnected && isAdmin ? <Admin user={user} setUser={setUser} isConnected={isConnected} isAdmin={isAdmin} /> : <Navigate to="/" />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

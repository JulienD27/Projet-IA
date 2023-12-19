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
        //console.log('loggedInUser from App : ' + loggedInUser);
        if (loggedInUser) {
            console.log('loggedInUser from App : ' + loggedInUser);
            user.username = JSON.parse(loggedInUser).username;
            user.password = JSON.parse(loggedInUser).password;
            user.studentId = JSON.parse(loggedInUser).studentId;
            user.userId = JSON.parse(loggedInUser).userId;
            console.log('user from App : ' + user.toString())
            if (loggedInUser.studentId === null)
                setIsAdmin(true);
            setConnected(true);
        }
        console.log(user);
        console.log("Is connected ? " + isConnected);
        console.log("Is admin ? " + isAdmin);
    } , []);

    return (
        <Router>
            <div>
                <NavBar isConnected={isConnected} setConnected={setConnected} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
                <Routes>
                    {/* Route de la page de connexion */}
                    <Route path="/" element={isConnected ? <Navigate to={isAdmin ? '/Admin' : '/Student'} /> : <LoginForm isAdmin={isAdmin} setIsAdmin={setIsAdmin} isConnected={isConnected} setConnected={setConnected} setUser={setUser} user={user} />} />
                    {/* Route vers la page d'étudiant */}
                    <Route path="/Student" element={isConnected && !isAdmin ? <Student user={user} setUser={setUser} isConnected={isConnected} /> : <Navigate to="/" />} />
                    {/* Route vers la page d'administration */}
                    <Route path="/Admin" element={isConnected && isAdmin ? <Admin user={user} setUser={setUser} isConnected={isConnected} /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

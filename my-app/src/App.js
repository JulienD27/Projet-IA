import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
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
        studentId: '',
        userId: '',
    });

    useEffect(() => {
        user.studentId === null ? setIsAdmin(true) : setIsAdmin(false);
        console.log(user);
        console.log("Is connected ? " + isConnected);
        console.log("Is admin ? " + isAdmin);
    } , [user]);

    return (
        <Router>
            <div>
                <NavBar isConnected={isConnected} setConnected={setConnected} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
                <Routes>
                    <Route path="/" element={<LoginForm isAdmin={isAdmin} setIsAdmin={setIsAdmin} isConnected={isConnected} setConnected={setConnected} setUser={setUser} user={user} />} />
                    <Route path="/Student" element={<Student user={user} setUser={setUser} isConnected={isConnected}/>}/>
                    <Route path="/Admin" element={<Admin user={user} setUser={setUser} isConnected={isConnected}/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;

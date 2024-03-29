import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import '../css/AuthForm.css';
import {useNavigate} from "react-router-dom";

function LoginForm({setIsAdmin, isAdmin, isConnected, setConnected, setUser, user}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const path = "http://localhost/my-app/projet_ia/";
    const history = useNavigate();

    const handleLoginChange = (e) => {
        setLogin(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    const handleSubmit = async (e) => {
        console.log('tentative de connexion avec ' + login + ' et ' + password)
        e.preventDefault();
        loginProcess()
    }

    const loginProcess = () => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login: login, password: password}),
        }
        console.log('request option : ' + requestOption.body)
        fetch(path + 'login.php', requestOption).then(response => response.json()).then(data => {
            //console.log('data : ' + data);
            if (data.status === "success") {
                localStorage.clear();
                alert(data.message);
                setConnected(true);
                user.userId = data.userId;
                user.username = data.username;
                user.password = password;
                if (!data.studentId)
                    user.studentId = null;
                else
                    user.studentId = data.studentId;
                console.log('user après login : ' + user.username + ' ' + user.password + ' ' + user.studentId + ' ' + user.userId);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('loggedInUser après login : ' + localStorage.getItem('user'));
                if (data.studentId === null){
                    //console.log('data.studentId === null')
                    setIsAdmin(true);
                    history('/Admin', {state: {user}});
                }
                else{
                    history('/Student', {state: {user}});
                }
            } else
                alert("Erreur lors de la connexion")
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        /*console.log('from login form')
        console.log(user);
        console.log(isConnected)
        console.log(isAdmin)*/
        const loggedInUser = localStorage.getItem("user");
        console.log('loggedInUser from loginForm : ' + loggedInUser)
        /*if (loggedInUser){
            setConnected(true);
            console.log('loggedInUser studenID from loginForm : ' + JSON.parse(loggedInUser).studentId)
            if (loggedInUser && !isNaN(JSON.parse(loggedInUser).studentId)) {
                history('/Student');
            }
            else if (loggedInUser && isNaN(JSON.parse(loggedInUser).studentId)){
                history('/Admin');
            }
        }*/
    }, [])

    return (
        <div className="auth-form-container">
            {
                !isConnected ?

                    <form onSubmit={handleSubmit} method="POST">
                        <h1 className="auth-form-title">Se connecter</h1>
                        <div>
                            <label className="auth-form-label">Nom d'utilisateur :</label>
                            <input name="login" className="auth-form-input" type="text" value={login}
                                   onChange={handleLoginChange}/>
                        </div>
                        <div>
                            <label className="auth-form-label">Mot de passe:</label>
                            <input name="password" className="auth-form-input" type="password" value={password}
                                   onChange={handlePasswordChange}/>
                        </div>
                        <Button className="auth-form-button" variant="contained" type="submit">
                            Se connecter
                        </Button>
                    </form> :

                    <></>
            }

        </div>
    );
}

export default LoginForm;

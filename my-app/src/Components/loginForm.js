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

    const handleSubmit = async (e) => {
        console.log('tentative de connexion avec ' + login + ' et ' + password)
        e.preventDefault();
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login: login, password: password}),
        }
        fetch(path + 'login.php', requestOption).then(response => response.json()).then(data => {
            console.log(data);
            if (data.status === "success") {
                alert(data.message);
                setConnected(true);
                setUser({
                    username: data.username,
                    studentId: data.studentId,
                    userId: data.userId,
                });
                if (data.studentId === null){
                    console.log('data.studentId === null')
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
        console.log('from login form')
        console.log(user);
        console.log(isConnected)
        console.log(isAdmin)
    }, [user])

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

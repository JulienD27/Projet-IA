import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


function NavBar({isConnected, setConnected, isAdmin, setIsAdmin}) {
    const navigate = useNavigate();
    const path = "http://localhost/my-app/projet_ia/";
    const handleLogout = async (e) => {
        e.preventDefault();

        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch(path + 'logout.php', requestOption).then(response => {
            console.log(response.status)
            if (response.status === 200) {
                alert('Déconnexion réussie')
                navigate('/');
                setConnected(false);
                setIsAdmin(false);
            } else
                alert('Erreur de déconnexion')
        })
            .catch(error => {
                alert('Erreur de déconnexion...')
            });

    };

    return (
        <AppBar position="relative">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" style={{textDecoration: 'none', color: 'white'}}>
                    Home
                </Typography>
                <div style={{flexGrow: 1}}></div>

                {
                    !isConnected ?
                        <Button component={Link} to="/" color="inherit">
                            Connexion
                        </Button>
                        :
                        <Button component={Link} to="/" color="inherit" onClick={handleLogout}>
                            Déconnexion
                        </Button>
                }
                {
                    isConnected && isAdmin ?
                        <Button component={Link} to="/Admin" color="inherit">
                            Admin
                        </Button> :
                        isConnected && !isAdmin ?
                        <Button component={Link} to="/Student" color="inherit">
                            Student
                        </Button> :
                        <></>
                }

            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
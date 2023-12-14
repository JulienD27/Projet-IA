import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


function NavBar() {
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();
    };

    return (
        <AppBar position="relative">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" style={{textDecoration: 'none', color: 'white'}}>
                    Home
                </Typography>
                <div style={{flexGrow: 1}}></div>

                <Button component={Link} to="/Student" color="inherit">
                    Student
                </Button>
                <Button component={Link} to="/Admin" color="inherit">
                    Admin
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {Button, Card, CardContent, TextField, Grid} from "@mui/material";
import customStyles from "./customStyles";
import {useLocation, useNavigate} from "react-router-dom";

const StudentInterface = (setUser, user, isConnected) => {
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        interviews: '',
    });
    const path = "http://localhost/my-app/projet_ia/";
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Fonction pour gérer la soumission des informations
    const addInfo = (event) => {
        event.preventDefault();
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({studentId: location.state.user.studentId, companyName: companyInfo.companyName, interviews: companyInfo.interviews , action: 1}),
        }
        fetch(path + 'manage_student_info.php', requestOptions).then((response) => response.json()).then((data) => {
            console.log(data);
            if (data.status === "success") {
                alert(data.message);
                console.log("Company info added")
            } else
                console.log("Erreur lors de l'ajout des informations")
        }).catch((error) => {
                console.log(error);
            });
        closeModal();
        console.log('Informations soumises : ', companyInfo);
        companyInfo.companyName = '';
        companyInfo.interviews = '';
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        /*if (!isConnected) {
            navigate('/');
        }*/
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '10px'
                }}>
                    <h2>Interface Étudiant</h2>
                    <Button onClick={openModal}
                            variant="contained"
                            color="primary"
                            style={{margin: '10px'}}>Ajouter des informations</Button>
                </div>
            </Grid>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={customStyles}
            >
                <h2 style={{marginBottom: '20px'}}>Entrez les informations du répertoire</h2>
                <Card className="directory-card">
                    <CardContent>
                        <form onSubmit={addInfo}>
                            <TextField
                                label="Company name"
                                variant="outlined"
                                value={companyInfo.companyName}
                                onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="Interview number"
                                variant="outlined"
                                helperText="Entre 0 et 5"
                                InputProps={{inputProps: {min: 0, max: 5}}}
                                type={'number'}
                                value={companyInfo.interviews}
                                onChange={(e) => setCompanyInfo({...companyInfo, interviews: e.target.value})}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <Button type="submit" variant="contained" color="primary"
                                        style={{marginRight: '20px', width: '100%', height: '50px'}}>Ajouter
                                    les informations</Button>
                                <Button type="button" variant="contained" color="secondary" onClick={closeModal}
                                        style={{marginLeft: '20px', width: '100%', height: '50px'}}>Annuler</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </Grid>
    );
};

export default StudentInterface;

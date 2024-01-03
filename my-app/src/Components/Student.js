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
    const history = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const [formattedStudentInfo, setFormattedStudentInfo] = useState({});
    const [studentID, setStudentID] = useState('');
    const [contactLogs, setContactLogs] = useState([]);
    const [studentInfo, setStudentInfo] = useState({year_of_study: '', stage_mark: ''});
    const [bulletin, setBulletin] = useState({});

    const formatContactLogs = (logs, studentInfo) => {
        const formattedLogs = logs.map((log) => ({
            company_name: log.company_name,
            total_interviews: log.total_interviews,
        }));

        return {
            logs: formattedLogs,
            info: studentInfo,
        };
    };

    const addInfo = (event) => {
        event.preventDefault();
        var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                studentId: studentID,
                companyName: companyInfo.companyName,
                interviews: companyInfo.interviews,
                action: 1
            }),
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
        getStudentInfo(studentID);
    };

    const updateStudentInfo = (userId, data) => {
        setFormattedStudentInfo(prevState => ({
            ...prevState,
            [userId]: data,
        }));
    };

    const getStudentInfo = (userId) => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({studentId: userId, action: 2}),
        };
        console.log('userId : ' + userId)
        fetch(path + 'manage_student_info.php', requestOption)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    getBulletin(userId)
                    console.log(data);
                    console.log(data.studentInfo)
                    console.log('Récupération des infos réussie');
                    setContactLogs(data.contactlogs || []);
                    const studentInformation = data.studentInfo && data.studentInfo.length > 0 ? data.studentInfo[0] : {};
                    setStudentInfo(studentInformation);
                    console.log('studentInformation : ', studentInformation);
                    //const formattedData = formatContactLogs(data.contactlogs, data.studentInfo);
                    //updateStudentInfo(userId, formattedData); // Mettre à jour avec les informations reçues
                } else {
                    console.log('Erreur de récupération des infos');
                }
            })
            .catch(error => {
                console.log('Erreur de récupération des infos ' + error);
            });
    };

    const getBulletin = (userId) => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                studentId: userId,
                action: 6
            }),
        }
        //console.log('request option : ' + requestOption.body)
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log('Récupération du bulletin réussie')
                console.log('Bulletin : ', data.bulletin[0])
                setBulletin(data.bulletin[0]);
                console.log('Bulletin : ', bulletin)
            } else
                console.log('Erreur lors de la récupération du bulletin')
        }).catch(error => {
            console.log('Erreur lors de la récupération du bulletin' + error)
        });
    }

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
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            console.log('id from local storage : ' + JSON.parse(localStorage.getItem('user')).studentId)
            setStudentID(JSON.parse(localStorage.getItem('user')).studentId);
        }
        /*else if (location.state.user.studentId !== null && location.state.user.studentId !== "undefined") {
            console.log('id from location state : ' + location.state.user.studentId)
            setStudentID(location.state.user.studentId);
        }*/

        console.log('loggedInUser from Student page : ' + localStorage.getItem('user'));
        if (localStorage.getItem('user') === null || localStorage.getItem('user') === "undefined") {
            navigate('/');
        } else {

            //const loggedInUser = JSON.parse(localStorage.getItem("user"));
            //console.log('loggedInUser username : ' + loggedInUser.username);
            //setStudentID(loggedInUser.studentId);
            //console.log('sans parse :' + loggedInUser.username)
        }
        //console.log('from student interface')
        //console.log('data received : ', location.state.user);
    }, []);

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '10px'
                }}>
                    <h1>Interface Étudiant</h1>
                    <h1>Bienvenue, {JSON.parse(localStorage.getItem("user")).username}</h1>
                    <img
                        src="https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png"
                        alt="Image de profil"
                        style={{width: '200px', height: '200px'}}
                    />
                    <Button onClick={openModal}
                            variant="contained"
                            color="primary"
                            style={{margin: '10px'}}>Ajouter des informations</Button>
                    <h2>Mes informations :</h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        {contactLogs.length === 0 && (
                            <Button
                                onClick={() => getStudentInfo(studentID)}
                                variant="contained"
                                color="primary"
                                style={{margin: '5px', width: '119px', height: '50px'}}
                            >
                                Obtenir mes infos
                            </Button>
                        )}

                        {/* Affichage des informations une fois les données récupérées */}
                        {studentInfo.year_of_study && (

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column'
                            }}>
                                <h2>Année d'étude : {studentInfo.year_of_study}</h2>
                                <h2>Historique des contacts avec les entreprises</h2>
                                {contactLogs.map((log, index) => (
                                    <div key={index}>
                                        <p>Vous avez contacté {log.company_name} {log.total_interviews} fois et
                                            avez
                                            obtenu {log.total_interviews} interviews</p>
                                    </div>
                                ))}
                                <h2>Bulletin</h2>
                                <table style={{borderCollapse: 'collapse',
                                border: '1px solid black',
                                width: '60%',
                                textAlign: 'center',
                                display: 'block'
                                }}>
                                    <thead>
                                    <tr>
                                        <th>Unité d'Enseignement</th>
                                        <th>Intitulé</th>
                                        <th>Note</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>UE1</td>
                                        <td>Réaliser</td>
                                        <td>{bulletin.UE1_Realiser}</td>
                                    </tr>
                                    <tr>
                                        <td>UE2</td>
                                        <td>Optimiser</td>
                                        <td>{bulletin.UE2_Optimiser}</td>
                                    </tr>
                                    <tr>
                                        <td>UE3</td>
                                        <td>Administrer</td>
                                        <td>{bulletin.UE3_Administrer}</td>
                                    </tr>
                                    <tr>
                                        <td>UE4</td>
                                        <td>Gérer</td>
                                        <td>{bulletin.UE4_Gerer}</td>
                                    </tr>
                                    <tr>
                                        <td>UE5</td>
                                        <td>Conduire</td>
                                        <td>{bulletin.UE5_Conduire}</td>
                                    </tr>
                                    <tr>
                                        <td>UE6</td>
                                        <td>Collaborer</td>
                                        <td>{bulletin.UE6_Collaborer}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <p>Note de stage : {studentInfo.stage_mark}</p>
                            </div>
                        )}
                    </div>
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

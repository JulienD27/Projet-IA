import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import customStyles from "./customStyles";
import '../css/global.css';
import {useNavigate} from "react-router-dom";

const AdminInterface = (setUser, user, isConnected, isAdmin) => {
    const path = "http://localhost/my-app/projet_ia/";
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentId, setStudentId] = useState(0);
    const [studentPassword, setStudentPassword] = useState('');
    const [studentYearOfStudy, setStudentYearOfStudy] = useState('');
    const [studentStageMark, setStudentStageMark] = useState('');
    const [studentInfo, setStudentInfo] = useState({});
    const [students, setStudents] = useState([]);
    const [formattedStudentInfo, setFormattedStudentInfo] = useState({});
    const navigate = useNavigate();
    const [bulletin, setBulletin] = useState([{UE1: ''}, {UE2: ''}, {UE3: ''}, {UE4: ''}, {UE5: ''}, {UE6: ''}]);
    const [studentBulletins, setStudentBulletins] = useState({});

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

    const fillBulletin = () => {
        console.log('On remplit le bulletin avec l\'id : ', studentId)
        console.log('Bulletin : ', bulletin)
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ue1: bulletin[0].UE1,
                ue2: bulletin[1].UE2,
                ue3: bulletin[2].UE3,
                ue4: bulletin[3].UE4,
                ue5: bulletin[4].UE5,
                ue6: bulletin[5].UE6,
                studentId: studentId,
                action: 5
            }),
        }
        console.log('request option : ' + requestOption.body)
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                alert(data.message)
                console.log('Ajoute des notes réussie')
                getBulletin(studentId)
            } else
                console.log('Erreur lors de l\'ajout des notes')
        }).catch(error => {
            console.log('Erreur lors de l\'ajout des notes' + error)
        });
        closeModal2();
    }


    const getBulletin = (userId) => {
        //console.log('On récupère le bulletin avec l\'id : ', userId)
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
                setStudentBulletins(prevState => ({
                    ...prevState,
                    [userId]: data.bulletin[0],
                }));
                console.log('Bulletin obtenu : ', studentBulletins[userId])
                //console.log('Bulletins : ', studentBulletins)
            } else
                console.log('Erreur lors de la récupération du bulletin')
        }).catch(error => {
            console.log('Erreur lors de la récupération du bulletin' + error)
        });
    }

    const addStudent = () => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                student_name: studentName,
                email: studentEmail,
                year_of_study: studentYearOfStudy,
                stage_mark: studentStageMark,
                password: studentPassword,
                action: 1
            }),
        }
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log('Création réussie')
                alert(data.message)
            } else
                console.log('Erreur de Création')
        }).catch(error => {
            console.log('Erreur de Création' + error)
        });
        closeModal();
        getAllStudents()
    };

    const getAllStudents = async () => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: 2}),
        }
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                //console.log(data.students)
                setStudents(data.students)
                console.log('Récupération des étudiants réussie')
                //console.log('Students : ', students)
            } else
                console.log('Erreur de récupération des étudiants')
        })
            .catch(error => {
                console.log('Erreur de récupération des étudiants' + error)
            });
        students.forEach((student) => {
            getStudentInfo(student.student_id);
            getBulletin(student.student_id)
        });
    }

    const removeStudent = (userId) => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({idStudent: userId, action: 3}),
        }
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log('Suppression réussie')
                const updatedStudents = students.filter((student) => student.id !== userId);
                setStudents(updatedStudents);
                //console.log('Students updated : ', students)
            } else
                console.log('Erreur de suppression')
        })
            .catch(error => {
                console.log('Erreur de suppression' + error)
            });
        console.log('Utilisateur supprimé avec l\'ID : ', userId);
        getAllStudents()
    };

    const getStudentInfo = (userId) => {
        getBulletin(userId)
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({studentId: userId, action: 2}),
        };
        fetch(path + 'manage_student_info.php', requestOption)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === "success") {
                    console.log('Récupération des infos réussie');
                    const formattedData = formatContactLogs(data.contactlogs, data.studentInfo);
                    updateStudentInfo(userId, formattedData); // Mettre à jour avec les informations reçues
                } else {
                    console.log('Erreur de récupération des infos');
                }
            })
            .catch(error => {
                console.log('Erreur de récupération des infos' + error);
            });
    };


    const updateStudentInfo = (userId, data) => {
        setFormattedStudentInfo(prevState => ({
            ...prevState,
            [userId]: data,
        }));
    };


    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openModal2 = (studentId) => {
        //console.log("On ouvre le bulletin avec l'id : ", studentId)
        setModalIsOpen2(true);
        setStudentId(studentId)
    }

    const closeModal2 = () => {
        setModalIsOpen2(false);
    }

    useEffect(() => {
        /*if (!user.studentId == null || !isConnected)
            navigate('/');*/
        getAllStudents()
        students.forEach((student) => {
            getStudentInfo(student.student_id);
            getBulletin(student.student_id)
        });
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
                    <h2>Interface Administrateur</h2>
                    <Button onClick={openModal}
                            variant="contained"
                            color="primary"
                            style={{margin: '10px'}}>Ajouter un étudiant</Button>
                    {
                        students.length < 1 ? (
                            <Button onClick={getAllStudents}
                                    variant="contained"
                                    color="primary"
                                    style={{margin: '10px'}}>Récupérer les étudiant
                            </Button>
                        ) : (
                            <></>
                        )
                    }
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <h2>Liste des étudiants :</h2>
                    <table style={{borderCollapse: 'collapse'}}>

                        <thead>
                        <tr>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>ID</th>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Photo</th>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Nom</th>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Actions</th>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Informations supplémentaires</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => (
                            <tr key={student.student_id}>
                                <td style={{
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    textAlign: 'center'
                                }}><b>{student.student_id}</b></td>
                                <td style={{padding: '10px', border: '1px solid #ccc', textAlign: 'center'}}>
                                    <img
                                        src="https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png"
                                        alt="Image de profil"
                                        style={{width: '200px', height: '200px'}}
                                    />
                                </td>
                                <td style={{
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    textAlign: 'center'
                                }}><b>{student.student_name}</b></td>
                                <td style={{padding: '10px', border: '1px solid #ccc', textAlign: 'center'}}>
                                    <Button
                                        onClick={() => removeStudent(student.student_id)}
                                        variant="contained"
                                        color="primary"
                                        style={{margin: '5px', width: '119px', height: '50px'}}
                                    >
                                        Supprimer de la liste
                                    </Button>
                                    <Button
                                        onClick={() => alert('y a rien à accéder...')}
                                        variant="contained"
                                        color="primary"
                                        style={{margin: '5px', width: '119px', height: '50px'}}
                                    >
                                        Gérer l'accès
                                    </Button>
                                    <Button
                                        onClick={() => openModal2(student.student_id)}
                                        variant="contained"
                                        color="primary"
                                        style={{margin: '5px', width: '119px', height: '50px'}}
                                    >
                                        Remplir les notes
                                    </Button>
                                </td>
                                <td style={{padding: '10px', border: '1px solid #ccc', textAlign: 'center'}}>
                                    {
                                        formattedStudentInfo[student.student_id] ? (
                                            <div>
                                                <h3>Informations de l'étudiant :</h3>
                                                {formattedStudentInfo[student.student_id].info.map((info, index) => (
                                                    <p>
                                                        Année d'étude : {info.year_of_study}
                                                        {/*info.year_of_study === "3" && <><p> Note de
                                                            stage: {info.stage_mark}</p></>*/}
                                                    </p>
                                                ))}
                                                <h3>Notes de l'étudiant :</h3>
                                                {formattedStudentInfo[student.student_id].info.map((info, index) => (
                                                    <>
                                                        {info.year_of_study === "3" &&
                                                            <p> Note de stage: {info.stage_mark}</p>}
                                                    </>
                                                ))}
                                                {studentBulletins[student.student_id] ? (
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        flexDirection: 'column'
                                                    }}>
                                                        <table style={{borderCollapse: 'collapse',
                                                            border: '1px solid black',
                                                            textAlign: 'center',
                                                            display: 'block'}}>
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
                                                                <td>Realiser</td>
                                                                <td>{studentBulletins[student.student_id].UE1_Realiser}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>UE2</td>
                                                                <td>Optimiser</td>
                                                                <td>{studentBulletins[student.student_id].UE2_Optimiser}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>UE3</td>
                                                                <td>Administrer</td>
                                                                <td>{studentBulletins[student.student_id].UE3_Administrer}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>UE4</td>
                                                                <td>Gerer</td>
                                                                <td>{studentBulletins[student.student_id].UE4_Gerer}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>UE5</td>
                                                                <td>Conduire</td>
                                                                <td>{studentBulletins[student.student_id].UE5_Conduire}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>UE6</td>
                                                                <td>Collaborer</td>
                                                                <td>{studentBulletins[student.student_id].UE6_Collaborer}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    ) : (
                                                    <p>Cet étudiant n'a pas encore de notes</p>
                                                    )}
                                                <h3>Contact avec les entreprises :</h3>
                                                {formattedStudentInfo[student.student_id].logs.length > 0 ? (
                                                    formattedStudentInfo[student.student_id].logs.map((log, index) => (
                                                        <p key={index}>
                                                            {`Cet étudiant a contacté ${log.company_name} ${log.total_interviews} fois et a obtenu ${log.total_interviews} interviews.`}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>Cet étudiant n'a pas encore contacté d'entreprise</p>
                                                )}
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => getStudentInfo(student.student_id)}
                                                variant="contained"
                                                color="primary"
                                                style={{margin: '5px', width: '119px', height: '50px'}}
                                            >
                                                Obtenir les infos
                                            </Button>
                                        )
                                    }
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>


            </Grid>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                style={customStyles}
                ariaHideApp={false}
            >
                <h2 style={{marginBottom: '20px'}}>Entrez les informations du répertoire</h2>
                <Card className="directory-card">
                    <CardContent>
                        <form onSubmit={addStudent}>
                            <TextField
                                label="Student name"
                                variant="outlined"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="Student email"
                                variant="outlined"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="Student password"
                                variant="outlined"
                                value={studentPassword}
                                onChange={(e) => setStudentPassword(e.target.value)}
                                required
                                type={'password'}
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="Student stage mark"
                                variant="outlined"
                                InputProps={{inputProps: {min: 0, max: 20}}}
                                type={'number'}
                                value={studentStageMark}
                                onChange={(e) => setStudentStageMark(e.target.value)}
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <FormControl variant="outlined" fullWidth style={{marginBottom: '10px'}}>
                                <InputLabel>Student year of study</InputLabel>
                                <Select
                                    value={studentYearOfStudy}
                                    onChange={(e) => setStudentYearOfStudy(e.target.value)}
                                    label="Student year of study"
                                    required
                                >
                                    <MenuItem value="1">1ère année</MenuItem>
                                    <MenuItem value="2">2ème année</MenuItem>
                                    <MenuItem value="3">3ème année</MenuItem>
                                </Select>
                            </FormControl>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                <Button type="submit" variant="contained" color="primary"
                                        style={{marginRight: '20px', width: '100%', height: '50px'}}>Ajouter
                                    l'étudiant</Button>
                                <Button type="button" variant="contained" color="secondary" onClick={closeModal}
                                        style={{marginLeft: '20px', width: '100%', height: '50px'}}>Annuler</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
            <Modal
                isOpen={modalIsOpen2}
                onRequestClose={closeModal2}
                contentLabel="Modal"
                style={customStyles}
                ariaHideApp={false}
            >
                <h2 style={{marginBottom: '20px'}}>Remplir le bulletin</h2>
                <Card className="directory-card">
                    <CardContent>
                        <form onSubmit={fillBulletin}>
                            <TextField
                                label="UE1"
                                variant="outlined"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 20,
                                        step: "any", // Permet les chiffres flottants
                                        pattern: "[0-9]+([.,][0-9]+)?" // Expression régulière pour les chiffres flottants
                                    },
                                    inputMode: "numeric" // Indique que le mode de saisie est numérique
                                }}
                                value={bulletin[0].UE1} // Accéder à la valeur UE1 dans le premier objet du tableau bulletin
                                onChange={(e) => {
                                    const updatedBulletin = [...bulletin]; // Créer une copie de l'état bulletin
                                    updatedBulletin[0].UE1 = e.target.value; // Mettre à jour la valeur de UE1 dans la copie
                                    setBulletin(updatedBulletin); // Mettre à jour l'état bulletin avec la copie modifiée
                                }}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="UE2"
                                variant="outlined"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 20,
                                        step: "any", // Permet les chiffres flottants
                                        pattern: "[0-9]+([.,][0-9]+)?" // Expression régulière pour les chiffres flottants
                                    },
                                    inputMode: "numeric" // Indique que le mode de saisie est numérique
                                }}
                                value={bulletin[1].UE2} // Accéder à la valeur UE1 dans le premier objet du tableau bulletin
                                onChange={(e) => {
                                    const updatedBulletin = [...bulletin]; // Créer une copie de l'état bulletin
                                    updatedBulletin[1].UE2 = e.target.value; // Mettre à jour la valeur de UE1 dans la copie
                                    setBulletin(updatedBulletin); // Mettre à jour l'état bulletin avec la copie modifiée
                                }}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="UE3"
                                variant="outlined"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 20,
                                        step: "any", // Permet les chiffres flottants
                                        pattern: "[0-9]+([.,][0-9]+)?" // Expression régulière pour les chiffres flottants
                                    },
                                    inputMode: "numeric" // Indique que le mode de saisie est numérique
                                }}
                                value={bulletin[2].UE3} // Accéder à la valeur UE1 dans le premier objet du tableau bulletin
                                onChange={(e) => {
                                    const updatedBulletin = [...bulletin]; // Créer une copie de l'état bulletin
                                    updatedBulletin[2].UE3 = e.target.value; // Mettre à jour la valeur de UE1 dans la copie
                                    setBulletin(updatedBulletin); // Mettre à jour l'état bulletin avec la copie modifiée
                                }}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="UE4"
                                variant="outlined"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 20,
                                        step: "any", // Permet les chiffres flottants
                                        pattern: "[0-9]+([.,][0-9]+)?" // Expression régulière pour les chiffres flottants
                                    },
                                    inputMode: "numeric" // Indique que le mode de saisie est numérique
                                }}
                                value={bulletin[3].UE4} // Accéder à la valeur UE1 dans le premier objet du tableau bulletin
                                onChange={(e) => {
                                    const updatedBulletin = [...bulletin]; // Créer une copie de l'état bulletin
                                    updatedBulletin[3].UE4 = e.target.value; // Mettre à jour la valeur de UE1 dans la copie
                                    setBulletin(updatedBulletin); // Mettre à jour l'état bulletin avec la copie modifiée
                                }}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="UE5"
                                variant="outlined"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 20,
                                        step: "any", // Permet les chiffres flottants
                                        pattern: "[0-9]+([.,][0-9]+)?" // Expression régulière pour les chiffres flottants
                                    },
                                    inputMode: "numeric" // Indique que le mode de saisie est numérique
                                }}
                                value={bulletin[4].UE5} // Accéder à la valeur UE1 dans le premier objet du tableau bulletin
                                onChange={(e) => {
                                    const updatedBulletin = [...bulletin]; // Créer une copie de l'état bulletin
                                    updatedBulletin[4].UE5 = e.target.value; // Mettre à jour la valeur de UE1 dans la copie
                                    setBulletin(updatedBulletin); // Mettre à jour l'état bulletin avec la copie modifiée
                                }}
                                required
                                fullWidth
                                style={{marginBottom: '10px'}}
                            />
                            <TextField
                                label="UE6"
                                variant="outlined"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 20,
                                        step: "any", // Permet les chiffres flottants
                                        pattern: "[0-9]+([.,][0-9]+)?" // Expression régulière pour les chiffres flottants
                                    },
                                    inputMode: "numeric" // Indique que le mode de saisie est numérique
                                }}
                                value={bulletin[5].UE6} // Accéder à la valeur UE1 dans le premier objet du tableau bulletin
                                onChange={(e) => {
                                    const updatedBulletin = [...bulletin]; // Créer une copie de l'état bulletin
                                    updatedBulletin[5].UE6 = e.target.value; // Mettre à jour la valeur de UE1 dans la copie
                                    setBulletin(updatedBulletin); // Mettre à jour l'état bulletin avec la copie modifiée
                                }}
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
                                    les notes</Button>
                                <Button type="button" variant="contained" color="secondary" onClick={closeModal2}
                                        style={{marginLeft: '20px', width: '100%', height: '50px'}}>Annuler</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Modal>
        </Grid>
    );
};

export default AdminInterface;

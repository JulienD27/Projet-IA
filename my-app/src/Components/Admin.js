import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {Button, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Grid} from "@mui/material";
import customStyles from "./customStyles";

const AdminInterface = () => {
    const path = "http://localhost/my-app/projet_ia/";
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentYearOfStudy, setStudentYearOfStudy] = useState('');
    const [studentStageMark, setStudentStageMark] = useState('');
    const [studentInfo, setStudentInfo] = useState({});
    const [students, setStudents] = useState([]);
    const [formattedStudentInfo, setFormattedStudentInfo] = useState({});

    const formatStudentInfo = (contactLogs) => {
        const formattedInfo = {};

        contactLogs.forEach((log) => {
            const studentId = log.student_id;
            const companyId = log.company_id;
            const interviewsCount = log.interviews_count;

            if (!formattedInfo[studentId]) {
                formattedInfo[studentId] = {};
            }

            if (!formattedInfo[studentId][companyId]) {
                formattedInfo[studentId][companyId] = interviewsCount;
            }
        });

        return formattedInfo;
    };

    const addStudent = () => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                student_name: studentName,
                email: studentEmail,
                year_of_study: studentYearOfStudy,
                stage_mark: studentStageMark,
                action: 1
            }),
        }
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log('Création réussie')
            } else
                console.log('Erreur de Création')
        }).catch(error => {
                console.log('Erreur de Création' + error)
            });
        closeModal();
    };

    const getAllStudents = () => {
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
    };

    const getStudentInfo = (userId) => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({studentId: userId, action: 2}),
        }
        fetch(path + 'manage_student_info.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log('Récupération des infos réussie')
                const formattedInfo = formatStudentInfo(data.contactlogs);
                setFormattedStudentInfo(formattedInfo);
            } else
                console.log('Erreur de récupération des infos')
        })
            .catch(error => {
                console.log('Erreur de récupération des infos' + error)
            });
    }

    const updateStudentInfo = (userId, info) => {
        const updatedStudents = students.map((student) => {
            if (student.student_id === userId) {
                return { ...student, additionalInfo: info };
            }
            return student;
        });
        setStudents(updatedStudents);
    }

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        getAllStudents()
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '10px'}}>
                    <h2>Interface Administrateur</h2>
                    <Button onClick={openModal}
                            variant="contained"
                            color="primary"
                            style={{margin: '10px'}}>Ajouter un utilisateur</Button>
                    <Button onClick={getAllStudents}
                            variant="contained"
                            color="primary"
                            style={{margin: '10px'}}>Récupérer les utilisateurs</Button>
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
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Nom</th>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Actions</th>
                            <th style={{padding: '10px', border: '1px solid #ccc'}}>Informations supplémentaires</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => (
                            <tr key={student.student_id}>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>{student.student_id}</td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>{student.student_name}</td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>
                                    <Button
                                        onClick={() => removeStudent(student.student_id)}
                                        variant="contained"
                                        color="primary"
                                        style={{margin: '5px', width: '119px', height: '50px'}}
                                    >
                                        Supprimer
                                    </Button>
                                    <Button
                                        onClick={() => getStudentInfo(student.student_id)}
                                        variant="contained"
                                        color="primary"
                                        style={{margin: '5px', width: '119px', height: '50px'}}
                                    >
                                        Obtenir les infos
                                    </Button>
                                </td>
                                <td style={{padding: '10px', border: '1px solid #ccc'}}>
                                    {formattedStudentInfo[student.student_id] ?
                                        Object.entries(formattedStudentInfo[student.student_id]).map(([companyId, contactCount]) => (
                                            <p key={companyId}>
                                                L'étudiant {student.student_id} a contacté
                                                l'entreprise {companyId} {contactCount} fois et a
                                                obtenu {contactCount} interviews.
                                            </p>
                                        ))
                                        : 'Pas d\'infos supplémentaires'} {/* Affichage des nouvelles infos */}
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
                                label="Student stage mark"
                                variant="outlined"
                                InputProps={{inputProps: {min: 0, max: 20}}}
                                type={'number'}
                                value={studentStageMark}
                                onChange={(e) => setStudentStageMark(e.target.value)}
                                required
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
        </Grid>
    );
};

export default AdminInterface;

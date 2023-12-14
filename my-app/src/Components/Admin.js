import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from "@mui/material";

const AdminInterface = () => {
    const path = "http://localhost/my-app/projet_ia/";
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentYearOfStudy, setStudentYearOfStudy] = useState('');
    const [studentStageMark, setStudentStageMark] = useState('');

    const [students, setStudents] = useState([]);

    const addStudent = () => {
        var requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({student_name: studentName, email: studentEmail, year_of_study: studentYearOfStudy, stage_mark: studentStageMark ,action: 1}),
        }
        fetch(path + 'manage_student.php', requestOption).then(response => response.json()).then(data => {
            console.log(data)
            if (data.status === "success") {
                console.log('Récupération réussie')
            }
            else
                console.log('Erreur de récupération')
        })
            .catch(error => {
                console.log('Erreur de récupération' + error)
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
                console.log(data.students)
                setStudents(data.students)
                console.log('Récupération réussie')
                console.log('Students : ', students)
            } else
                console.log('Erreur de récupération')
        })
            .catch(error => {
                console.log('Erreur de récupération' + error)
            });
    }

    const removeStudent = (userId) => {
        // Ajouter la logique pour supprimer l'utilisateur avec l'ID spécifié de la liste (envoyer au backend, etc.)
        // const updatedUsers = users.filter((user) => user.id !== userId);
        // setUsers(updatedUsers);
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
                console.log('Students updated : ', students)
            }
            else
                console.log('Erreur de suppression')
        })
            .catch(error => {
                console.log('Erreur de suppression' + error)
            });
        console.log('Utilisateur supprimé avec l\'ID : ', userId);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    // Fonction pour fermer la modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            maxWidth: '500px',
            width: '100%',
            height: '500px',
            textAlign: 'center'
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <h2>Interface Administrateur</h2>
                <button onClick={openModal}>Ajouter un utilisateur</button>
                <button onClick={getAllStudents}>Récupérer les utilisateurs</button>
                <ul>
                    {students.map((student) => (
                        <li key={student.student_id}>
                            {student.student_name}
                            <button onClick={() => removeStudent(student.student_id)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
                {/* Autres éléments d'interface pour la gestion des accès et des informations pour la prédiction */}
            </Grid>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Modal"
                    style={customStyles}
                >
                    <h2 style={{ marginBottom: '20px' }}>Entrez les informations du répertoire</h2>
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
                                    style={{ marginBottom: '10px' }}
                                />
                                <TextField
                                    label="Student email"
                                    variant="outlined"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    required
                                    fullWidth
                                    style={{ marginBottom: '10px' }}
                                />
                                <TextField
                                    label="Student stage mark"
                                    variant="outlined"
                                    type={'number'}
                                    value={studentStageMark}
                                    onChange={(e) => setStudentStageMark(e.target.value)}
                                    required
                                    fullWidth
                                    style={{ marginBottom: '10px' }}
                                />
                                <FormControl variant="outlined" fullWidth style={{ marginBottom: '10px' }}>
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
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Button type="submit" variant="contained" color="primary" style={{ marginRight: '20px', width: '100%', height: '50px' }}>Ajouter l'étudiant</Button>
                                    <Button type="button" variant="contained" color="secondary" onClick={closeModal} style={{ marginLeft: '20px', width: '100%', height: '50px' }}>Annuler</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </Modal>
        </Grid>
    );
};

export default AdminInterface;

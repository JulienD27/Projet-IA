import React, { useState } from 'react';

const StudentInterface = () => {
    // État local pour stocker les informations saisies par l'étudiant
    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        interviews: 0,
        // ... autres informations
    });

    // Fonction pour gérer la soumission des informations
    const handleSubmit = (event) => {
        event.preventDefault();
        // Effectuer des actions avec les données saisies par l'étudiant (envoyer au backend, etc.)
        console.log('Informations soumises : ', companyInfo);
        // Réinitialiser le formulaire ou afficher un message de confirmation
        // setCompanyInfo({ companyName: '', interviews: 0, ... autres informations });
    };

    return (
        <div>
            <h2>Interface Étudiant</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom de l'entreprise :
                    <input
                        type="text"
                        value={companyInfo.companyName}
                        onChange={(e) =>
                            setCompanyInfo({ ...companyInfo, companyName: e.target.value })
                        }
                    />
                </label>
                <label>
                    Nombre d'entretiens :
                    <input
                        type="number"
                        value={companyInfo.interviews}
                        onChange={(e) =>
                            setCompanyInfo({ ...companyInfo, interviews: e.target.value })
                        }
                    />
                </label>
                {/* Autres champs de saisie pour d'autres informations */}
                <button type="submit">Soumettre</button>
            </form>
        </div>
    );
};

export default StudentInterface;

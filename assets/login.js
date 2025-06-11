const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit');


async function login(email, password) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.status === 404) {
            alert('Utilisateur non trouvé');
            return;
        }

        if (!response.ok) {
            alert('Erreur lors de la connexion');
            return;
        }

        const data = await response.json();
        // Si la connexion réussit, stockez le token et redirigez
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
        console.log(data);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la connexion');
    }
}
submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    login(email, password);
});

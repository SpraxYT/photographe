const token = localStorage.getItem('token');
const loginElement = document.getElementById('loginElement');
const editionElement = document.querySelector('.edition');
const addWorkLink = document.querySelector('.add-work'); // Get the 'modifier' link

if (token) {
    // User is logged in
    loginElement.textContent = 'logout';
    if (editionElement) {
        editionElement.style.display = 'flex'; // Or 'block', depending on your CSS for .edition.show
    }
    if (addWorkLink) {
        addWorkLink.style.display = 'inline'; // Or 'block', depending on your CSS
    }

    loginElement.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html'; // Redirect to home or login page
    });
} else {
    // User is not logged in
    loginElement.textContent = 'login';
    if (editionElement) {
        editionElement.style.display = 'none';
    }
    if (addWorkLink) {
        addWorkLink.style.display = 'none';
    }
}
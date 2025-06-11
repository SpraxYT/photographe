const gallery = document.querySelector('.gallery');
const categoriesElement = document.querySelector('.categories');
const modal = document.querySelector('.modal');
const modalArrowClose = document.querySelector('.modal .close');
const modalArrowBack = document.querySelector('.modal .back-arrow');
const modalContent = document.querySelector('.modal-content');
const modalGallery = document.querySelector('.modal-gallery');
const modalAddPhoto = document.querySelector('.modal-add-photo');
const addPhotoBtn = document.querySelector('.add-photo-btn');
const validateBtn = document.querySelector('.validate-btn');
const photoUploadInput = document.getElementById('photo-upload');
const previewImage = document.getElementById('preview-image');
const addPhotoForm = document.getElementById('add-photo-form');
const modalTitle = document.querySelector('.modal-content h2');

const addWork = document.querySelector('.add-work');
addWork.addEventListener('click', () => {
    modal.classList.remove('hide');
    showGalleryView();
});

modalArrowClose.addEventListener('click', () => {
    modal.classList.add('hide');
    resetModal();
});

modal.addEventListener('click', () => {
    modal.classList.add('hide');
    resetModal();
});

modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
});

modalArrowBack.addEventListener('click', () => {
    showGalleryView();
});

addPhotoBtn.addEventListener('click', async () => {
    try {
        await showAddPhotoView();
    } catch (error) {
        console.error('Error handling add photo click:', error);
    }
});

function updateValidateButton() {
    try {
        const formData = new FormData(addPhotoForm);
        const isFormValid = formData.get('title') && formData.get('category') && formData.get('image');
        
        if (isFormValid) {
            validateBtn.classList.remove('inactive');
        } else {
            validateBtn.classList.add('inactive');
        }
    } catch (error) {
        console.error('Error updating button state:', error);
        validateBtn.classList.add('inactive');
    }
}

validateBtn.addEventListener('click', () => {
    const formData = new FormData(addPhotoForm);
    if (formData.get('title') && formData.get('category') && formData.get('image')) {
        addWorkToDb(formData);
    } else {
        alert('Veuillez remplir tous les champs');
    }
});

// Add event listeners for form fields
document.getElementById('title').addEventListener('input', updateValidateButton);
document.getElementById('category').addEventListener('change', updateValidateButton);

photoUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            document.querySelector('.upload-container i').style.display = 'none';
            document.querySelector('.custom-file-upload').style.display = 'none';
            document.querySelector('.file-info').style.display = 'none';
        };
        reader.readAsDataURL(file);
        updateValidateButton();
    }
});

async function addWorkToDb(formData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout de la photo');
        }

        // Refresh galleries and reset modal
        const works = await fetchWorks();
        displayWorks(works);
        showGalleryView();
        resetModal();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function showGalleryView() {
    modalTitle.textContent = 'Galerie photo';
    modalGallery.style.display = 'flex';
    modalAddPhoto.classList.remove('show');
    modalArrowBack.classList.add('hidden');
    addPhotoBtn.style.display = 'block';
    validateBtn.classList.add('hidden');
    displayModalWorks();
}

async function showAddPhotoView() {
    try {
        modalTitle.textContent = 'Ajout photo';
        modalGallery.style.display = 'none';
        modalAddPhoto.classList.add('show');
        modalArrowBack.classList.remove('hidden');
        addPhotoBtn.style.display = 'none';
        validateBtn.classList.remove('hidden');
        validateBtn.classList.add('inactive');
        
        // Reset form and elements before fetching categories
        addPhotoForm.reset();
        document.querySelector('.upload-container i').style.display = 'block';
        document.querySelector('.custom-file-upload').style.display = 'block';
        document.querySelector('.file-info').style.display = 'block';
        if (!previewImage.src) {
            previewImage.classList.add('hidden');
        }
        
        // Fetch categories after resetting the form
        await fetchCategoriesOption();
        
        // Update button state after everything is set up
        updateValidateButton();
    } catch (error) {
        console.error('Error showing add photo view:', error);
    }
}

function resetModal() {
    addPhotoForm.reset();
    previewImage.classList.add('hidden');
    previewImage.src = '';
    document.querySelector('.upload-container i').style.display = 'block';
    document.querySelector('.custom-file-upload').style.display = 'block';
    document.querySelector('.file-info').style.display = 'block';
    showGalleryView();
}



// Fetch categories and populate select
async function fetchCategoriesOption() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
        }
        const categories = await response.json();
        const categorySelect = document.getElementById('category');
        
        // Clear existing options
        while (categorySelect.firstChild) {
            categorySelect.removeChild(categorySelect.firstChild);
        }
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '';
        categorySelect.appendChild(defaultOption);
        
        // Add categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
}



async function deleteWork(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }
        
        // Refresh both galleries
        const works = await fetchWorks();
        displayWorks(works);
        displayModalWorks();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function displayModalWorks() {
    const works = await fetchWorks();
    modalGallery.innerHTML = '';
    
    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.classList.add('modal-work');
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-button');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.addEventListener('click', () => deleteWork(work.id));
        
        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
}


// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const works = await response.json();
        return works;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

function displayWorks(works) {
    gallery.innerHTML = '';
    works.forEach(work => {
        let title = work.title;
        let imageUrl = work.imageUrl;
        const figure = document.createElement('figure');
        figure.classList.add('work');
        figure.dataset.categoryId = work.categoryId.toString();
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    })
}

async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

function displayCategories(categories) {
    categoriesElement.innerHTML = '';
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.classList.add('category');
    allButton.dataset.categoryId = '0';
    allButton.classList.add('active');
    categoriesElement.appendChild(allButton);
    categories.forEach(category => {
        let name = category.name;
        const button = document.createElement('button');
        button.textContent = name;
        button.classList.add('category');
        button.dataset.categoryId = category.id;
        categoriesElement.appendChild(button);
    });

    // Gestion des catégories
    const categoryButtons = document.querySelectorAll('.category');
    categoryButtons.forEach(categoryButton => {
        categoryButton.addEventListener('click', () => {
            // Enleve la classe active de tous les boutons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Ajoute la classe active au bouton cliqué
            categoryButton.classList.add('active');

            const categoryId = categoryButton.dataset.categoryId;
            const works = document.querySelectorAll('.work');
            works.forEach(work => {
                const workCategoryId = work.dataset.categoryId;
                if (categoryId === '0' || workCategoryId === categoryId) {
                    work.style.display = 'block';
                } else {
                    work.style.display = 'none';
                }
            });
        });
    });
}

// Récupération et affichage des travaux
fetchWorks().then(works => {
    displayWorks(works);
});

// Récupération et affichage des catégories
fetchCategories().then(categories => {
    displayCategories(categories);
})

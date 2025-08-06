// fetch api
// async/await in javascript
async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    return works;
}

function updateWorksOnPage(works, parentElem, showCaptions = true, showDelete = false) {
    parentElem.innerHTML = "";

    for (let i = 0; i < works.length; ++i) {
        const currentWork = works[i];


        const figure = document.createElement('figure');
        figure.classList.add('work-item');

        const img = document.createElement('img');
        img.src = currentWork.imageUrl; // Make sure this key exists
        img.alt = currentWork.title || 'No title';

        figure.appendChild(img);

        if (showCaptions && currentWork.title) {
            const caption = document.createElement('figcaption');
            caption.innerText = currentWork.title;
            figure.appendChild(caption);
        }
        // Add data-id attribute to figure for later use
        figure.dataset.id = currentWork.id;


        if (showDelete) {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-pic');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';

           deleteBtn.addEventListener('click', () => {
  const id = figure.dataset.id; // get the id from the dataset
  const token = localStorage.getItem('token'); // token for authorization

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to delete from API');
      return res.text(); // or res.json(), depending on your API
    })
    .then(() => {
      figure.remove(); // ✅ Only remove from DOM if API call was successful
    })
    .catch(err => {
      console.error('Error deleting:', err);
      alert('Failed to delete image. Are you logged in or authorized?');
    });
});


            figure.appendChild(deleteBtn);
        }

        parentElem.appendChild(figure);
    }
}



async function main() {
    // fetch works from api
    const works = await fetchWorks();

    // update DOM with the works
    const galleryElem = document.querySelector('#portfolio .gallery');
    updateWorksOnPage(works, galleryElem, true, false);
}


main();
// login func //
function doLogin() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loginLink = document.getElementById('loginLink');
    const myProject = document.getElementById('myProject');
    const pjButtons = document.querySelector('.pjButtons');

    //looking for token//
    if (token) {
        const logoutLink = document.createElement('a');
        logoutLink.innerText = 'Logout';
        logoutLink.classList.add('logOut');
        logoutLink.href = '#';
        pjButtons.style.display = 'none'; 

        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            localStorage.removeItem('token');
            localStorage.removeItem('userId');

        
        const editButton = document.querySelector('.editButton');
        if (editButton) {
            editButton.remove();
            }
                const pjButtons = document.querySelector('.pjButtons');
        if (pjButtons) {
            pjButtons.style.display = 'block';
        }


        const loginAgain = document.createElement('a');
        loginAgain.innerText = 'Login';
            loginAgain.href = 'login/login.html';
            loginLink.replaceChildren(loginAgain);
        });
        
        // adds edit button//
        loginLink.replaceChildren(logoutLink);

        const editBut = document.createElement('button');
        editBut.innerText = 'Edit';
        editBut.classList.add('editButton');
        myProject.appendChild(editBut);

        editBut.addEventListener('click', () => {
            openEditingModal();
        });

    } else {
        const loginAgain = document.createElement('a');
        loginAgain.innerText = 'Login';
        loginAgain.href = 'login/login.html';
        loginLink.replaceChildren(loginAgain);
    }
}


doLogin();
const loginLink = document.getElementById("loginLink")

//reversed buttons colors//
const pjButtons = document.querySelectorAll(".pjButton");

pjButtons.forEach(function(button) {
  button.addEventListener("click", function () {

    pjButtons.forEach(b => b.classList.remove("clicked"));

    button.classList.add("clicked");
  });
});



// opening modal for edit //
async function openEditingModal() {
  const editingModal = document.getElementById("editingModal");
  editingModal.style.display = "flex";

  const works = await fetchWorks();

  const modalPictures = document.getElementById("modalPictures");


  updateWorksOnPage(works, modalPictures, false, true); 

  // Wait for DOM to update
  setTimeout(() => {
    resetImgPreview(); // Restore uploadBox with input
    imgPreview();      // Attach listener again
  }, 0);
}

 // Store original HTML when the page loads
const uploadBox = document.getElementById('uploadBox');
const originalContent = uploadBox.innerHTML;

function imgPreview() {
  const fileInput = document.getElementById('image');

  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = function (e) {
        uploadBox.innerHTML = `
          <img src="${e.target.result}" class="uploaded-preview" alt="Selected Image">
        `;
      };

      reader.readAsDataURL(file);
    }
  });
}
// Call once when the page loads
imgPreview();






// shows other modal window
function addPictureModal() {
  const addPicForm = document.getElementById("addPicForm");
  const modal1 = document.getElementById("modal1");
  modal1.style.display = "none";
  addPicForm.style.display = "block";
}






  
function goBack(){
    const addPicForm = document.getElementById("addPicForm");
    const modal1 = document.getElementById("modal1");
    if (addPicForm) { addPicForm.style.display = "none";
    modal1.style.display = "flex";}

}
// closes modal
function closeModal() {
  const modal1 = document.getElementById("modal1");
  const addPicForm = document.getElementById("addPicForm");
  const editingModal = document.getElementById("editingModal"); // define it here

  if (editingModal) {
    editingModal.style.display = "none"; 
  }

  if (addPicForm) {
    addPicForm.style.display = "none";
  }

  if (modal1) {
    modal1.style.display = "flex"; 
  }

  
  resetImgPreview();
}








document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("closeModal2").addEventListener("click", closeModal);
document.getElementById('addPhoto').addEventListener('click', addPictureModal);
document.getElementById('backBut').addEventListener('click', goBack);



// fetch api
// async/await in javascript
async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    return works;
}

function updateWorksOnPage(works, parentElem, showCaptions = true) {
    parentElem.innerHTML = ""; 

    for (let i = 0; i < works.length; ++i) {
        const currentWork = works[i];

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = currentWork.imageUrl;
        img.alt = currentWork.title;

        
        figure.appendChild(img);

        
        if (showCaptions) {
            const caption = document.createElement('figcaption');
            caption.innerText = currentWork.title;
            figure.appendChild(caption);
        }

        parentElem.appendChild(figure);
    }
}


async function main() {
    // fetch works from api
    const works = await fetchWorks();

    // update DOM with the works
    const galleryElem = document.querySelector('#portfolio .gallery');
    updateWorksOnPage(works, galleryElem);
}


main();

function doLogin() {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (token) {
        const loginLink = document.getElementById('loginLink')
        const elem = document.createElement('a')
            elem.innerText = 'Logout'
            elem.classList.add('logOut')
            elem.href = 'login/login.html'
            loginLink.replaceChildren(elem)
        const myProject = document.getElementById('myProject')
        const editBut = document.createElement('button')
            editBut.innerText = 'Edit'
            editBut.classList.add('editButton')
            myProject.appendChild(editBut)

            editBut.addEventListener('click', () => {
               openEditingModal()
            })


    }
}
doLogin();
const loginLink = document.getElementById("loginLink")



async function openEditingModal() {
  const editingModal = document.getElementById("editingModal");
  editingModal.style.display = "flex";

  const works = await fetchWorks();

  const modalPictures = document.getElementById("modalPictures");
  modalPictures.innerHTML = ""; 

  updateWorksOnPage(works, modalPictures, false); 

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



// fetch api
// async/await in javascript
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

function updateWorksOnPage(
  works,
  parentElem,
  showCaptions = true,
  showDelete = false
) {
  parentElem.innerHTML = "";

  for (let i = 0; i < works.length; ++i) {
    const currentWork = works[i];

    const figure = document.createElement("figure");
    figure.classList.add("work-item");
    figure.dataset.id = currentWork.id; // store work ID here

    const img = document.createElement("img");
    img.src = currentWork.imageUrl;
    img.alt = currentWork.title || "No title";
    img.dataset.category = currentWork.categoryId; // category filter support
    figure.appendChild(img);

    // Optional caption
    if (showCaptions && currentWork.title) {
      const caption = document.createElement("figcaption");
      caption.innerText = currentWork.title;
      figure.appendChild(caption);
    }

    // Optional delete button (SAFE outside of forms)
    if (showDelete) {
      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("type", "button"); // extra safe
      deleteBtn.classList.add("deletePic");
      deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" 
            viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520
                q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Z
                m160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      `;

      deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();
  deleteWork(figure);
      });

      figure.appendChild(deleteBtn);
    }

    parentElem.appendChild(figure);
  }
}

async function deleteWork(figure) {
  const id = figure.dataset.id;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete from API");

    // Fetch updated works and update gallery
    const works = await fetchWorks();
    const galleryElem = document.querySelector("#portfolio .gallery");
    updateWorksOnPage(works, galleryElem, true, false);
    // Also refresh modal images if modal is open
    if (document.getElementById("editingModal")?.style.display === "flex") {
      await loadModalImages();
    }

  } catch (err) {
    console.error("Error deleting:", err);
    alert("Failed to delete image. Are you logged in or authorized?");
  }
}



async function main() {
  // fetch works from api
  const works = await fetchWorks();

  // update DOM with the works
  const galleryElem = document.querySelector("#portfolio .gallery");
  updateWorksOnPage(works, galleryElem, true, false);
}

main();
// login func //
function doLogin() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const loginLink = document.getElementById("loginLink");
  const myProject = document.getElementById("myProject");
  const pjButtons = document.querySelector(".pjButtons");

  //looking for token //
  if (token) {
    const logoutLink = document.createElement("a");
    logoutLink.innerText = "Logout";
    logoutLink.classList.add("logOut");
    logoutLink.href = "#";
    pjButtons.style.display = "none";

    // deletes token on logout//
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      const editButton = document.querySelector(".editButton");
      if (editButton) {
        editButton.remove();
      }
      const pjButtons = document.querySelector(".pjButtons");
      if (pjButtons) {
        pjButtons.style.display = "flex";
      }

      const loginAgain = document.createElement("a");
      loginAgain.innerText = "Login";
      loginAgain.href = "login/login.html";
      loginAgain.classList.add("logOut");
      loginLink.replaceChildren(loginAgain);
    });

    // adds edit button//
    loginLink.replaceChildren(logoutLink);

    const editBut = document.createElement("button");
    editBut.innerText = "Edit";
    editBut.type = "button";
    editBut.classList.add("editButton");
    myProject.appendChild(editBut);

    editBut.addEventListener("click", () => {
      openEditingModal();
    });
  } else {
    const loginAgain = document.createElement("a");
    loginAgain.innerText = "Login";
    loginAgain.href = "login/login.html";
    loginLink.replaceChildren(loginAgain);
  }
}

doLogin();
const loginLink = document.getElementById("loginLink");

//reversed buttons colors//
const pjButtons = document.querySelectorAll(".pjButton");

pjButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Remove "clicked" class from all buttons
    pjButtons.forEach((b) => b.classList.remove("clicked"));

    const category = button.dataset.filter; // <-- use button's filter

    // Select all images
    const images = document.querySelectorAll(".gallery img");

    // Filter images
    images.forEach((img) => {
      const figure = img.parentElement; // Get the parent figure element
      if (category === "all" || img.dataset.category === category) {
        figure.style.display = "block"; // show matching
      } else {
        figure.style.display = "none"; // hide others
      }
    });

    // Add "clicked" class to the current button
    button.classList.add("clicked");
  });
});

// opening modal for edit //

async function loadModalImages() {
  const works = await fetchWorks();
  const modalPictures = document.getElementById("modalPictures");
  // Clear previous images
  modalPictures.innerHTML = "";
  // Render images for modal
  updateWorksOnPage(works, modalPictures, false, true);
}

async function openEditingModal() {
  const editingModal = document.getElementById("editingModal");
  editingModal.style.display = "flex";
  await loadModalImages();
}

const uploadBox = document.getElementById("uploadBox");
const originalContent = uploadBox.innerHTML;
// for img preview
function imgPreview() {
  const fileInput = document.getElementById("image");

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
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
// for chosing img on click
document.getElementById("uploadBox").addEventListener("click", () => {
  document.getElementById("image").click();
});

//submits form to api
document.getElementById("confirmButton").addEventListener("click", (e) => {
  e.preventDefault(); // stop form refresh
  const uploadForm = document.getElementById("uploadForm");
  const formData = new FormData(uploadForm);
  const token = localStorage.getItem("token"); // if your API requires auth
  // Basic validation
 const fileInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");

if (!fileInput.files.length) {
  alert("Please upload an image.");
  return;
}

if (!titleInput.value.trim()) {
  alert("Please enter a title.");
  return;
}

if (!categoryInput.value) {
  alert("Please select a category.");
  return;
}


  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Image uploaded successfully");
        return response.json();
      } else {
        console.error("Upload failed");
        return response.text().then((text) => console.error(text));
      }
    })
    .then((data) => {
      if (data) {
        console.log("API Response:", data);

        // refresh gallery immediately with new work
        const galleryElem = document.querySelector("#portfolio .gallery");
        fetchWorks().then((works) => updateWorksOnPage(works, galleryElem, true, false));

        // reset form & preview
        uploadForm.reset();
        resetImgPreview();
        loadModalImages(); // refresh modal images
        goBack();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});


function goBack() {
  const addPicForm = document.getElementById("addPicForm");
  const modal1 = document.getElementById("modal1");
  if (addPicForm) {
    addPicForm.style.display = "none";
    modal1.style.display = "flex";
  }
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
document.getElementById("addPhoto").addEventListener("click", addPictureModal);
document.getElementById("backBut").addEventListener("click", goBack);

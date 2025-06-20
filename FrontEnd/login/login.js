
const signInButton = document.getElementById("signInButton")

signInButton.addEventListener ("click", async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
try {
const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
});

const responseData = await response.json();
console.log(responseData)
if (response.ok) {
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("userId", responseData.userId);
     window.location.href = "../index.html";

} else {
    alert("Invalid email or password");
    }
} catch (error) {
    console.error("Error:", error);
    alert("Error try again later.");
}

});

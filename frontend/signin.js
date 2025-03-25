document.getElementById("signin-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    let email = document.getElementById("signin-email").value.trim();
    let password = document.getElementById("signin-password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || "Login failed"); });
        }
        return response.json();
    })
    .then((data) => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert("Login failed. Please check your credentials.");
        }
    })
    .catch((error) => {
        console.error("❌ Error:", error);
        alert(error.message || "Error logging in. Please try again.");
    });
});

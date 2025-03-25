// JavaScript for Dashboard Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized access. Please log in.");
        window.location.href = "signin.html";
        return;
    }

    // Event listener for clicking dashboard cards
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function () {
            showSection(this.dataset.section);
        });
    });

    // Show default section (first section)
    const firstSection = document.querySelector(".section");
    if (firstSection) {
        firstSection.style.display = "block";
    }
});

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

function logout() {
    alert("Logging out...");
    localStorage.removeItem("token"); // Clear the login token
    window.location.href = "signin.html"; // Redirect to sign-in page
}

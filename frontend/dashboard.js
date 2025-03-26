// JavaScript for Dashboard Functionality (Modern UI)
document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized access. Please log in.");
        window.location.href = "signin.html";
        return;
    }

    // Load user profile data
    loadUserProfile();
    
    // Load emergency contacts
    loadEmergencyContacts();

    // Event listener for dashboard cards
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

    // Event listener for profile update
    document.getElementById("update-profile-btn").addEventListener("click", updateUserProfile);

    // Event listener for profile picture upload
    document.getElementById("profile-pic-input").addEventListener("change", updateProfilePicture);

    // Event listener for adding emergency contact (modern pop-up)
    document.getElementById("add-contact-btn").addEventListener("click", function () {
        document.getElementById("contact-modal").style.display = "block";
    });

    document.getElementById("save-contact-btn").addEventListener("click", addEmergencyContact);

    // Close modal event
    document.getElementById("close-modal").addEventListener("click", function () {
        document.getElementById("contact-modal").style.display = "none";
    });
});

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.style.display = "none";
    });
    const section = document.getElementById(sectionId);
    section.style.display = "block";
    section.classList.add("active-section");
}

function logout() {
    alert("Logging out...");
    localStorage.removeItem("token");
    window.location.href = "signin.html";
}

// Emergency Contacts Functions (Modern UI with Colors & Cards)
function addEmergencyContact() {
    const name = document.getElementById("contact-name").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();

    if (!name || !phone) {
        alert("Please enter both name and phone number.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    let contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];

    if (contacts.some(contact => contact.phone === phone)) {
        alert("This contact number already exists.");
        return;
    }

    contacts.push({ name, phone });
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
    loadEmergencyContacts();

    alert("Emergency contact added successfully!");
    document.getElementById("contact-modal").style.display = "none";
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-phone").value = "";
}

function loadEmergencyContacts() {
    const contactsList = document.getElementById("contacts-list");
    contactsList.innerHTML = "";
    let contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];

    contacts.forEach((contact, index) => {
        let card = document.createElement("div");
        card.classList.add("contact-card");
        card.innerHTML = `<div class="contact-info"><strong>${contact.name}</strong><br>${contact.phone}</div>
                          <button onclick="deleteContact(${index})" class="delete-btn">❌</button>`;
        contactsList.appendChild(card);
    });
}

function deleteContact(index) {
    let contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    contacts.splice(index, 1);
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
    loadEmergencyContacts();
    alert("Contact deleted successfully.");
}

// Profile Management Functions (Modern UI)
function loadUserProfile() {
    document.getElementById("user-email").textContent = localStorage.getItem("userEmail") || "user@example.com";
    document.getElementById("user-fullname").textContent = localStorage.getItem("userName") || "User Name";
    const profilePic = localStorage.getItem("profilePic");
    if (profilePic) {
        document.getElementById("profile-pic").src = profilePic;
    }
}

function updateUserProfile() {
    const newName = document.getElementById("new-name").value.trim();
    const newEmail = document.getElementById("new-email").value.trim();

    if (!newName || !newEmail) {
        alert("Please enter both name and email.");
        return;
    }

    localStorage.setItem("userName", newName);
    localStorage.setItem("userEmail", newEmail);
    document.getElementById("user-fullname").textContent = newName;
    document.getElementById("user-email").textContent = newEmail;
    alert("Profile updated successfully!");
}

function updateProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem("profilePic", e.target.result);
            document.getElementById("profile-pic").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Bluetooth Connection Simulation (Modern UI)
function connectBluetooth() {
    const bluetoothStatus = document.getElementById("bluetooth-status");
    bluetoothStatus.textContent = "Connecting...";
    bluetoothStatus.style.color = "orange";
    
    setTimeout(() => {
        bluetoothStatus.textContent = "Connected to Smart Earring";
        bluetoothStatus.style.color = "green";
        alert("Bluetooth Connected Successfully!");
    }, 2000);
}

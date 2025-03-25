document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value.trim();
    let submitButton = document.querySelector("#signup-form button");

    // Disable button to prevent multiple clicks
    submitButton.disabled = true;
    submitButton.textContent = "Registering...";

    // ✅ Basic Validations
    if (!name || !email || !password) {
        showAlert("⚠ All fields are required.");
        resetButton();
        return;
    }

    if (!validateEmail(email)) {
        showAlert("⚠ Please enter a valid email address.");
        resetButton();
        return;
    }

    if (password.length < 6) {
        showAlert("⚠ Password must be at least 6 characters long.");
        resetButton();
        return;
    }

    // ✅ Check if backend is reachable before sending request
    try {
        const checkBackend = await fetch("http://127.0.0.1:5000/test");
        if (!checkBackend.ok) {
            throw new Error("Backend is unreachable. Check if the server is running.");
        }
    } catch (error) {
        console.error("❌ Backend Connection Error:", error);
        showAlert("❌ Backend is not reachable. Please check the server.");
        resetButton();
        return;
    }

    // ✅ User data for backend
    const userData = { name, email, password };

    try {
        console.log("🔵 Sending request to server...");
        console.log("📤 Request Data:", userData);

        const response = await fetch("http://127.0.0.1:5000/api/auth/register",  {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        console.log("🟢 Response Received:", response);

        // ✅ Handle Fetch Response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("📩 Response Data:", data);

        if (data.message === "User registered successfully!") {
            showAlert("✅ Registration Successful! Redirecting to Sign In...", "success");
            document.getElementById("signup-form").reset();
            setTimeout(() => (window.location.href = "signin.html"), 2000);
        } else {
            throw new Error(data.error || "Registration failed.");
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        showAlert(`❌ ${error.message}`);
    } finally {
        resetButton();
    }
});

// ✅ Function to validate email format
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Function to reset button state
function resetButton() {
    let submitButton = document.querySelector("#signup-form button");
    submitButton.disabled = false;
    submitButton.textContent = "Sign Up";
}

// ✅ Function to show alert messages
function showAlert(message, type = "error") {
    let alertBox = document.getElementById("alert-message");
    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "alert-message";
        alertBox.style.position = "fixed";
        alertBox.style.top = "20px";
        alertBox.style.left = "50%";
        alertBox.style.transform = "translateX(-50%)";
        alertBox.style.padding = "10px 20px";
        alertBox.style.borderRadius = "5px";
        alertBox.style.color = "#fff";
        alertBox.style.fontSize = "14px";
        alertBox.style.zIndex = "1000";
        document.body.appendChild(alertBox);
    }

    alertBox.style.backgroundColor = type === "success" ? "green" : "red";
    alertBox.textContent = message;
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
}

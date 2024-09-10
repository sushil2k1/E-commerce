const signForm = document.getElementById('sign-form');
const loginForm = document.getElementById('login-form');
let submit = document.getElementById('submit');
let input = document.getElementsByTagName('input');

// Function for storing user registration to the database
signForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate form inputs
    let name = input[0].value.trim();
    let username = input[1].value.trim();
    let password = input[2].value.trim();
    let mobile = input[3].value.trim();

    if (name === '' || username === '' || password === '' || mobile === '') {
        alert("All fields are required.");
        return;
    }

    if (name.length < 3) {
        alert("Name must be at least 3 characters long.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
        alert("Invalid email address.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert("Invalid mobile number, it must be a 10-digit number.");
        return;
    }

    let formdata = new FormData();
    formdata.append('name', name);
    formdata.append('username', username);
    formdata.append('password', password);
    formdata.append('mobile', mobile);

    fetch('/signupAdmin', {
        method: 'POST',
        body: formdata
    }).then((response) => response.json())
      .then((data) => {
        if (data.errors) {
            alert(data.errors.map(error => error.msg).join("\n"));
        } else if (data.msg === "Already exists") {
            alert("User already exists");
        } else {
            alert("User registered successfully");
            signForm.reset();
            signDiv.style.display = 'none';
            loginDiv.style.display = 'block';
        }
    }).catch((err) => {
        alert("Error occurred: " + err.message);
    });
});

// Functionality for hiding and showing the display of login and sign-in form
let logBtn = document.getElementById('logBtn');
let signBtn = document.getElementById('signBtn');
let loginDiv = document.getElementById('log');
let signDiv = document.getElementById('sign');

logBtn.addEventListener('click', function (e) {
    e.preventDefault();
    signDiv.style.display = 'none';
    loginDiv.style.display = 'block';
});

signBtn.addEventListener('click', function (e) {
    e.preventDefault();
    loginDiv.style.display = 'none';
    signDiv.style.display = 'block';
});

// Verify user before login
let loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append('logUser', input[4].value.trim());
    formdata.append('logPass', input[5].value);
console.log(input[5].value);
    fetch('/loginAdmin', {
        method: 'POST',
        body: formdata
    }).then((response) => response.json())
      .then((data) => {
        if (data.mesg === "Incorrect password") {
            alert("Incorrect password");
        } else if (data.mesg === "failed") {
            alert("User not found");
        } else {
            alert("Successfully logged in");
            window.location.href = "/admin";
        }
    }).catch((err) => {
        console.log("Error occurred:", err);
    });
});

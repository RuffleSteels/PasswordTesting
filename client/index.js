document.getElementById("username").value = "RuffleSteels"
document.getElementById("email").value = "raffers.smith@gmail.com"
document.getElementById("password").value = "Password1234!"

function clicked() {
    
    const fields = { 
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value 
    }


    const expressions = {
        username: [/^[a-zA-Z0-9]{5,}$/, "• Your username must have more than 4 characters and must not include special characters or spaces"],
        email: [/@/, "• Your email is not valid"],
        password: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s])(?!.*\s).{9,}$/, "• Your password must have more than 8 characters, include a special character, include a number, include a capital and lowercase letter, and must not have spaces"]
    }

    const messages = [];

    for (const field in fields) {
        if (fields.hasOwnProperty(field)) {
            const value = fields[field];
            const [regex, errorMessage] = expressions[field];
            if (!regex.test(value)) {
                document.getElementById(field+"Error").classList.add("errorMessage")
                messages.push(errorMessage);
            }
        }
    }

    if (messages.length > 0) {
        return
    }
    for (el of document.getElementsByClassName("errorMessageHide")) {
        el.classList.remove("errorMessage")
    }

    fetch("/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
    }).then((response) => response.json()).then((data) => {
        if (data.value == -1) {
            alert("both")
        } else if (data.value == -2) {
            alert("username")
        } else {
            alert("email")
        }
    })
}
document.getElementById("username").value = "RuffleSteels"
document.getElementById("password").value = "Password1234!"

function logIn() {
    
    const fields = { 
        username: document.getElementById("username").value,
        password: document.getElementById("password").value 
    }


    fetch("/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
    }).then((response) => response.json()).then((data) => {
        if (Number.isInteger(data.value)) {
            if (data.value == -1) {
                alert("password incorrect")
            } else {
                
                alert("username don't exist")
            }
        } else {
            // login sucessful
        }
    })
}
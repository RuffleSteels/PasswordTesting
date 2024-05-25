fetch("/dashboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
}).then((response) => response.json()).then((data) => {
    document.getElementById("data").value = data.userData
})


function save() {
    const currentData = document.getElementById("data").value
    fetch("/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: currentData }),
    }).then((response) => response.json()).then((data) => {
        if (data.value == -1) {
            alert("save failed")
        } else {
            alert("success")
        }
    })
}

function logOut() {
    document.cookie = "sessionToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/login"
}

function deleteAccount() {
    const confirmedPassword = document.getElementById("deleteAccountConfirmation").value
    if (confirmedPassword != "") {
        fetch("/deleteAccount", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: confirmedPassword }),
        }).then((response) => response.json()).then((data) => {
            if (data.value == -1) {
                alert("incorrect password")
            } else {
                logOut()
            }
        })
    }
}

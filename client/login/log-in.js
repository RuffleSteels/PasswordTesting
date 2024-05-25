function logIn() {
    
    const fields = { 
        username: document.getElementById("username").value,
        password: document.getElementById("password").value 
    }
    fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
    }).then((response) => response.json()).then((data) => {
        console.log(data)
        if (Number.isInteger(data.value)) {
            if (data.value == -1) {
                alert("password incorrect")
            } else {
                
                alert("username don't exist")
            }
        } else {
            var d=new Date();
            d.setTime(d.getTime()+(50*24*60*60*1000));
            document.cookie = "sessionToken="+data.value+";expires="+d.toUTCString()+";path=/;secure";
            window.location.href = "/dashboard"
        }
    })
}

function signUp() {
    window.location.href = "/signup"
}

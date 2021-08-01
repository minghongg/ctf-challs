$(document).ready(() => {
    $("#submit").click(() => {
        const email = $("#email").val();
        const password = $("#password").val();
        fetch("https://chevaliers.xyz/api/login", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email : email,
                password: password
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.message){
                return swal("Error!", data.message, "error");
            }else{
                const token = data.token;
                localStorage.setItem('token',token);
                swal("Success!", "You've successfully logged in", "success")
                .then(result => {
                    window.location.href = "/";
                })
            }
        })
    })
});
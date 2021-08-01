$(document).ready(() => {
    $("#submit").click(() => {
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const email = $("#email").val();
        const password = $("#password").val();
        fetch("https://chevaliers.xyz/api/register", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName : firstName,
                lastName : lastName,
                email : email,
                password: password
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.message !== "User Created!"){
                return swal("Error!", data.message, "error");
            }
            else{
                swal("Success!", "You've successfully registered", "success")
                .then(result => {
                    window.location.href = "/login";
                })
            }
        })
    })
});
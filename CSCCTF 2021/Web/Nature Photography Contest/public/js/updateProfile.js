$(document).ready(() => {
    $("#submit").click(() => {
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const email = $("#email").val();
        const aboutMe = $("#aboutMe").val();
        
        fetch("https://chevaliers.xyz/api/profile", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                firstName : firstName,
                lastName : lastName,
                email : email,
                aboutMe : aboutMe
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data.message !== "User has been updated successfully"){
                swal("Error!", data.message, "error")
                .then(result => {
                    window.location.href = '/profile'
                });
            }else{
                swal("Success!", "User has been updated successfully", "success")
                .then(result => {
                    window.location.href = '/profile'
                });
            }
        })
    })
});
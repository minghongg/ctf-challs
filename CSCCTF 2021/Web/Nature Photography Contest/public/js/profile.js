$(document).ready(() => {
    fetch("https://chevaliers.xyz/api/profile", {
        method: "get",
        headers: {
            'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.message){
            return swal("Error!", data.message, "error").then(result => {
                window.location.href = "/"
            });
        }
        else{
            $("#firstName").val(() => {
                return data.firstName;
            })
            $("#lastName").val(() => {
                return data.lastName;
            })
            $("#email").val(() => {
                return data.email;
            })
            $("#aboutMe").val(() => {
                return data.aboutMe;
            })
        }
    })
});

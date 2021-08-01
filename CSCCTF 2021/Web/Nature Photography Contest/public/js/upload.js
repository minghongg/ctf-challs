$(document).ready(() => {
    $("#submit").click(() => {
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const email = $("#email").val();
        const link = $("#link").val();
        fetch("https://chevaliers.xyz/api/upload", {
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
                link : link
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            if(data.message !== "Thank you! Your submission has been sent"){
                swal("Error!", data.message, "error")
                .then(result => {
                    window.location.href = '/upload'
                });
            }else{
                swal("Success!", "Thank you! Your submission has been sent", "success")
                .then(result => {
                    window.location.href = '/upload';
                });
            }
        })
    })
})
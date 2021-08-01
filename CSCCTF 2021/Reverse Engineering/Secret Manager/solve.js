Java.perform(function(){
    var hook = Java.use("com.chevaliers.secretmanager.secret.Secret");
    hook.f.overload("com.google.firebase.firestore.DocumentSnapshot").implementation = function(a){
        console.log(a.toString());
        return a.toString();
    }
});
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB2S--M6FdhqkgB9lMosxKb40CUdPio5Zc",
    authDomain: "juegovertigo.firebaseapp.com",
    databaseURL: "https://juegovertigo-default-rtdb.firebaseio.com",
    projectId: "juegovertigo",
    storageBucket: "juegovertigo.appspot.com",
    messagingSenderId: "850388292562",
    appId: "1:850388292562:web:88aaa44c4571f5cf05ee0b",
    measurementId: "XXXXXXXXXXXXX"
});
const db = firebaseApp.database();
const auth = firebaseApp.auth();
var emailField = document.getElementById("email");
var passwordField = document.getElementById("password");

// Agrega un event listener al botón de inicio de sesión
document.getElementById("loginButton").addEventListener("click", function () {
    var email = emailField.value;
    var password = passwordField.value;

    // Llama al método de inicio de sesión de Firebase con el correo electrónico y contraseña proporcionados
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            // Verifica si el correo electrónico del usuario está verificado
            if (userCredential.user.emailVerified) {
                // Inicio de sesión exitoso, redirige al usuario al juego
                window.location.href = "index.html";
            } else {
                // Correo electrónico no verificado, muestra el mensaje de error
                alert("Por favor verifica tu correo");
            }
        })
        .catch(function (error) {
            // Manejo de errores de inicio de sesión
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert("Error al iniciar sesión");
        });
});
// Obtener referencias a los campos de entrada
const emailFieldSignUp = document.getElementById("emailSignUp");
const passwordFieldSignUp = document.getElementById("passwordSignUp");
const passwordConfirmFieldSignUp = document.getElementById("passwordConfirmSignUp");
const displayNameFieldSignUp = document.getElementById("displayNameSignUp");
const registerButton = document.getElementById("registerButton");
const forgotPasswordBtn = document.getElementById("passwordForgot");
forgotPasswordBtn.addEventListener("click", function () { forgotPassword(); });
registerButton.addEventListener("click", function () {
    const email = emailFieldSignUp.value;
    const password = passwordFieldSignUp.value;
    const passwordConfirm = passwordConfirmFieldSignUp.value;
    const displayName = displayNameFieldSignUp.value;


    if (password !== passwordConfirm) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Crear un usuario con correo electrónico y contraseña
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            // Registro exitoso, establecer el displayName del usuario
            return userCredential.user.updateProfile({
                displayName: displayName
            });
        })
        .then(function () {
            // displayName establecido, enviar correo de verificación
            return firebase.auth().currentUser.sendEmailVerification();
        })
        .then(function () {
            // Correo de verificación enviado, muestra el mensaje informativo
            alert("Correo de verificación enviado!");
        })
        .catch(function (error) {
            // Manejo de errores de registro
            alert("Error al registrarse");
            console.error(error);
        });
});
// Función para el inicio de sesión con Google
function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            window.location.href = "index.html";
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
}
//Olvido de contraseña
function forgotPassword() {
    var email = prompt("Por favor, ingresa tu correo electrónico para restablecer la contraseña:");
    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(function () {
                alert("Se ha enviado un correo electrónico para restablecer la contraseña. Por favor, revisa tu bandeja de entrada.");
            })
            .catch(function (error) {
                alert("Ha ocurrido un error al enviar el correo electrónico: " + error.message);
            });
    }
}
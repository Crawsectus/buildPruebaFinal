//variables gloables

var container = document.getElementById("container");
var recContraseña = document.getElementById("recuperarContraseña");


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
                showError("No se ha verificado el correo electrónico");
                inputError("email");
            }
        })
        .catch(function (error) {
            handleFirebaseError(error);
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
        inputError("passwordSignUp");
        inputError("passwordConfirmSignUp");
        passwordConfirmFieldSignUp.value = "";
        showError("Las contraseñas no coinciden");
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
            showSuccess("Se ha enviado un correo de verificación a " + email + ". Por favor, verifique su correo electrónico y luego inicie sesión. Si no encuentra el correo revise la carpeta de spam.");
        })
        .catch(function (error) {
            // Manejo de errores de registro
            handleFirebaseError(error);
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
            handleFirebaseError(error);
        });
}
// olvido contraseña
function forgotPassword() {
    container.style.display = "none";
    recContraseña.style.display = "flex";

    var botonSend = document.getElementById("sendPasswordForgot");
    var botonVolver = document.getElementById("volverLogin");

    botonVolver.addEventListener("click", function () {
        container.style.display = "flex";
        recContraseña.style.display = "none";
    });

    botonSend.addEventListener("click", function () {
        var email = document.getElementById("emailPasswordForgot").value;

        if (email == "") {
            inputError("emailPasswordForgot");
            showError("Ingrese un correo electrónico");
            return;
        }
        firebase.auth().sendPasswordResetEmail(email)
            .then(function () {
                showSuccess("Correo enviado");
            })
            .catch(function (error) {
                handleFirebaseError(error);
            });
    });
}


function inputError(inputUsuario) {
    var input = document.getElementById(inputUsuario);
    input.classList.add("error");
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        iconColor: '#ad181e',
        title: 'Error',
        color: '#dfe5eb',
        text: message,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ad181e',
        background: '#1c1c1c'
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: '¡Muy Bien!',
        color: '#dfe5eb',
        text: message,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ad181e',
        background: '#1c1c1c'
    });
}

function handleFirebaseError(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            showError('Correo electrónico inválido');
            inputError("email");
            break;
        case 'auth/user-disabled':
            showError('Usuario deshabilitado');
            inputError("email");
            break;
        case 'auth/user-not-found':
            showError('Usuario no encontrado');
            inputError("email");
            break;
        case 'auth/wrong-password':
            showError('Contraseña incorrecta');
            inputError("password");
            break;
        case 'auth/email-already-in-use':
            showError('Correo electrónico ya registrado');
            inputError("emailSignUp");
            break;
        case 'auth/weak-password':
            showError('Contraseña débil');
            inputError("passwordSignUp");
            inputError("passwordConfirmSignUp");
            break;
        case 'auth/operation-not-allowed':
            showError('Operación no permitida');
            break;
        case 'auth/too-many-requests':
            showError('Demasiadas solicitudes. Intente más tarde');
        // Otros casos de error de Firebase Authentication...
        default:
            showError('Error: ' + error.message);
            break;
    }
}


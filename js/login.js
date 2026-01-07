const ADMIN_USER = "Farmaplus";
const ADMIN_PASS = "Farma26";

const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem("logueado", "true");

        Swal.fire({
            title: "Ya has iniciado sesión!",
            icon: "success",
            draggable: true
        }).then(() => {
            window.location.href = "../index.html";
        });

    } else {
        Swal.fire({
            title: "Usuario o contraseña incorrectos",
            icon: "error",
            draggable: true
        });
    }
});

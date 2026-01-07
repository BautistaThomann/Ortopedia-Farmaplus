const logueado = sessionStorage.getItem("logueado");

if (logueado !== "true") {
    window.location.href = "../html/login.html";
}

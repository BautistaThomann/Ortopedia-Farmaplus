const API_PRODUCTOS = "https://695884716c3282d9f1d53041.mockapi.io/productos";
const API_ALQUILERES = "https://695884716c3282d9f1d53041.mockapi.io/alquileres";

const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

const nombreProducto = document.getElementById("nombre-producto");
const inputDias = document.getElementById("dias");
const spanTotal = document.getElementById("total");
const mensaje = document.getElementById("mensaje");
const btnAlquilar = document.getElementById("btn-alquilar");
const form = document.getElementById("form-alquiler");

let producto = null;

inputDias.disabled = true;
btnAlquilar.disabled = true;

fetch(`${API_PRODUCTOS}/${idProducto}`)
    .then(res => res.json())
    .then(data => {
        producto = data;
        nombreProducto.textContent = producto.nombre;
        inputDias.disabled = false;
    })
    .catch(() => {
        nombreProducto.textContent = "Error al cargar producto";
    });

inputDias.addEventListener("input", () => {
    if (!producto) return;

    const dias = Number(inputDias.value);

    mensaje.textContent = "";
    btnAlquilar.disabled = false;

    if (dias <= 0) {
        spanTotal.textContent = 0;
        btnAlquilar.disabled = true;
        return;
    }

    if (dias > 30) {
        mensaje.textContent = "Máximo 30 días";
        spanTotal.textContent = 0;
        btnAlquilar.disabled = true;
        return;
    }

    let total = 0;

    if (dias === 15) {
        total = producto.precio15;
    } else if (dias === 30) {
        total = producto.precio30;
    } else {
        total = dias * producto.precioDia;
    }

    spanTotal.textContent = total;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!producto) return;

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const dias = Number(inputDias.value);
    const total = Number(spanTotal.textContent);

    if (!nombre || !apellido || !telefono || dias <= 0 || dias > 30) {
        mensaje.textContent = "Completá todos los datos correctamente";
        return;
    }

    const hoy = new Date();
    const fechaInicio = hoy.toISOString().split("T")[0];

    const fechaFin = new Date(hoy);
    fechaFin.setDate(fechaFin.getDate() + dias);

    const alquiler = {
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cliente: `${nombre} ${apellido}`,
        telefono: telefono,
        dias: dias,
        total: total,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin.toISOString().split("T")[0],
        estado: "activo", // NUEVO
        fechaDevolucionReal: null // NUEVO
    };

    fetch(API_ALQUILERES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alquiler)
    })
        .then(res => res.json())
        .then(() => {

            fetch(`${API_PRODUCTOS}/${producto.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...producto,
                    estado: false
                })
            });

            Swal.fire({
                icon: "success",
                title: "Alquiler registrado",
                text: "El alquiler se registró correctamente",
                confirmButtonText: "Aceptar"
            }).then(() => {
                sessionStorage.setItem("recordarImpresion", "true");
                window.location.href = "../html/alquileres.html";
            });

            btnAlquilar.disabled = true;
            form.reset();
            spanTotal.textContent = 0;
            inputDias.disabled = true;
        })
        .catch(() => {
            alert("Error al registrar el alquiler");
        });
});
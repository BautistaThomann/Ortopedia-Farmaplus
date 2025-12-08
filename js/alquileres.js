import { actualizarEstadosProductos } from "./productos.js";

// Cargar alquileres desde localStorage
let alquileres = JSON.parse(localStorage.getItem("alquileres")) || [];

const contenedor = document.getElementById("lista-alquileres");

window.addEventListener("DOMContentLoaded", () => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: "success",
        title: "Recordá imprimir el contrato de alquiler una vez alquilada la prenda!"
    });
});


function renderAlquileres() {
    alquileres = JSON.parse(localStorage.getItem("alquileres")) || [];
    contenedor.innerHTML = "";

    alquileres.forEach((alquiler, index) => {
        const card = document.createElement("div");
        card.classList.add("alquiler-card");

        const hoy = new Date();
        const fechaDevolucion = new Date(alquiler.fechaDevolucion);

        let estado = "";
        let clase = "";

        const diferenciaDias = Math.ceil((fechaDevolucion - hoy) / (1000 * 60 * 60 * 24));

        if (diferenciaDias > 3) {
            estado = "Optimo";
            clase = "optimo";
        } else if (diferenciaDias > 0) {
            estado = "Por vencer";
            clase = "por-vencer";
        } else {
            estado = "Vencido";
            clase = "vencido";
        }

        card.innerHTML = `
            <h3>${alquiler.producto}</h3>
            <p><strong>Cliente:</strong> ${alquiler.nombre} ${alquiler.apellido}</p>
            <p><strong>Teléfono:</strong> ${alquiler.telefono}</p>
            <p><strong>Días:</strong> ${alquiler.dias}</p>
            <p><strong>Fecha inicio:</strong> ${alquiler.fechaInicio}</p>
            <p><strong>Fecha devolución:</strong> ${alquiler.fechaDevolucion}</p>
            <p><strong>Estado:</strong> <span class="estado ${clase}">${estado}</span></p>

            <div class="botones">
                <button class="btn-imprimir" data-index="${index}">Imprimir</button>
                <button class="btn-devuelto" data-index="${index}">Marcar devuelto</button>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </div>
        `;

        contenedor.appendChild(card);
    });

    activarBotones();
}

function activarBotones() {
    // Botón imprimir
    document.querySelectorAll(".btn-imprimir").forEach(btn => {
        btn.addEventListener("click", () => imprimirAlquiler(btn.dataset.index));
    });

    // Botón marcar devuelto
    document.querySelectorAll(".btn-devuelto").forEach(btn => {
        btn.addEventListener("click", () => marcarDevuelto(btn.dataset.index));
    });

    // Botón eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarAlquiler(btn.dataset.index));
    });
}

function imprimirComprobante(datos) {
    const contenido = `
        <html>
        <head>
            <title>Comprobante</title>
            <style>
                body { font-family: Arial; padding: 17px; }
                p { font-size: 16px; line-height: 1.4; }
                .columna-1, .columna-2 { width: 45%; display: inline-block; vertical-align: top; }
            </style>
        </head>
        <body class="comprobante">
        <h2>Comprobante de Alquiler</h2>
            <div class="columna-1">
                <p><strong>Producto:</strong> ${datos.producto}</p>
                <p><strong>Nombre:</strong> ${datos.nombre}</p>
                <p><strong>Apellido:</strong> ${datos.apellido}</p>
                <p><strong>Teléfono:</strong> ${datos.telefono}</p>
            </div>
            <div class="columna-2">
                <p><strong>Días:</strong> ${datos.dias}</p>
                <p><strong>Fecha inicio:</strong> ${datos.fechaInicio}</p>
                <p><strong>Fecha devolución:</strong> ${datos.fechaDevolucion}</p>
                <p><strong>Total a pagar:</strong> ${datos.total}</p>
            </div>
            <p>Me comprometo a cuidar el producto durante el período de alquiler y devolverlo en las mismas condiciones en la que lo recibí. En caso contrario, me hago responsable de pagar los daños o pérdidas del producto alquilado.</p>
            <br>
            <p><strong>Firma y aclaración:</strong> ________________________</p>
            <hr>
            <p>Gracias por confiar en nosotros | <strong>Farmacia Farmaplus - División Ortopedia</strong></p>
        </body>
        </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(contenido);
    iframe.contentDocument.close();

    iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 500);
    };
}

function marcarDevuelto(index) {
    // 1. Obtener la lista actual de alquileres
    let alquileres = JSON.parse(localStorage.getItem("alquileres")) || [];

    // 2. Guardar el nombre del producto devuelto
    const productoDevuelto = alquileres[index].producto;

    // 3. Eliminar el alquiler de la lista
    alquileres.splice(index, 1);

    // 4. Volver a guardarla
    localStorage.setItem("alquileres", JSON.stringify(alquileres));

    // 5. Actualizar la lista de productos alquilados
    let productosAlquilados = JSON.parse(localStorage.getItem("productosAlquilados")) || [];

    // 6. Sacar el producto devuelto de la lista
    productosAlquilados = productosAlquilados.filter(p => p !== productoDevuelto);

    // 7. Guardarlo de nuevo
    localStorage.setItem("productosAlquilados", JSON.stringify(productosAlquilados));

    // 8. Render normal
    renderAlquileres();
    actualizarEstadosProductos(); 

    // 9. Mensaje
    Swal.fire({
        title: "¡Alquiler marcado como devuelto!",
        icon: "success",
        draggable: true
    });
}

function eliminarAlquiler(index) {
    // 1. Obtener alquileres actuales
    let alquileres = JSON.parse(localStorage.getItem("alquileres")) || [];

    // 2. Guardar qué producto se está eliminando
    const productoEliminado = alquileres[index].producto;

    // 3. Eliminar ese alquiler
    alquileres.splice(index, 1);

    // 4. Guardar los alquileres actualizados
    localStorage.setItem("alquileres", JSON.stringify(alquileres));

    // 5. Actualizar la lista de productos alquilados
    let productosAlquilados = JSON.parse(localStorage.getItem("productosAlquilados")) || [];

    // 6. Sacar el producto eliminado
    productosAlquilados = productosAlquilados.filter(p => p !== productoEliminado);

    // 7. Guardar de nuevo
    localStorage.setItem("productosAlquilados", JSON.stringify(productosAlquilados));

    // 8. Render normal
    renderAlquileres();
    actualizarEstadosProductos(); 

    Swal.fire({
        title: "¡Alquiler eliminado!",
        icon: "error",
        draggable: true
    });
}

function imprimirAlquiler(index) {
    const datos = alquileres[index];
    imprimirComprobante(datos);
}

renderAlquileres();

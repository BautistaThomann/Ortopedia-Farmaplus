import { productos } from "../js/productos.js";

const params = new URLSearchParams(window.location.search);
const nombreProducto = params.get("producto");

// Mostrar nombre del producto
document.getElementById("producto-seleccionado").textContent =
    nombreProducto ? nombreProducto : "Producto no encontrado";

// Guardar producto en el hidden del form
document.getElementById("producto").value = nombreProducto;

// Buscar el producto dentro del array
const productoData = productos.find(p => p.nombre === nombreProducto);

// Inputs
const inputDias = document.getElementById("dias");
const precioTotal = document.getElementById("precio-total");

const form = document.getElementById("form-alquiler");

inputDias.addEventListener("input", () => {
    // Si no existe el producto
    if (!productoData) {
        precioTotal.textContent = "Producto inválido";
        return;
    }

    let dias = parseInt(inputDias.value);
    let total = 0;

    // Validación de días
    if (dias <= 0 || isNaN(dias)) {
        precioTotal.textContent = "—";
        return;
    }

    if (productoData.porDia === null) {
        if (dias === 30) {
            precioTotal.textContent = "$ " + productoData.treintaDias;
        } else {
            precioTotal.textContent = "Este articulo solo se puede alquilar por 30 días.";
        }
        return;
    }

    // Cálculo normal
    if (dias < 15) {
        total = dias * productoData.porDia;
    } else if (dias === 15) {
        total = productoData.quinceDias;
    } else if (dias < 30) {
        total = productoData.quinceDias + (dias - 15) * productoData.porDia;
    } else if (dias === 30) {
        total = productoData.treintaDias;
    } else {
        total = productoData.treintaDias + (dias - 30) * productoData.porDia;
    }

    precioTotal.textContent = "$ " + Math.round(total);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    const dias = parseInt(document.getElementById("dias").value);
    const producto = nombreProducto;
    const precio = precioTotal.textContent;

    const fechaInicio = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaInicio.getDate() + dias);

    const alquiler = {
        producto,
        nombre,
        apellido,
        telefono,
        dias,
        total: precio,
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaDevolucion: fechaDevolucion.toISOString().split("T")[0]
    };

    // Guardar alquiler
    let lista = JSON.parse(localStorage.getItem("alquileres")) || [];
    lista.push(alquiler);
    localStorage.setItem("alquileres", JSON.stringify(lista));

    // ACTUALIZAR lista de productos alquilados
    let productosAlquilados = JSON.parse(localStorage.getItem("productosAlquilados")) || [];

    if (!productosAlquilados.includes(producto)) {
        productosAlquilados.push(producto);
    }

    localStorage.setItem("productosAlquilados", JSON.stringify(productosAlquilados));

    Swal.fire({
        title: "¡Alquiler registrado con éxito!",
        icon: "success",
        draggable: true
    }).then(() => {
        window.location.href = "./alquileres.html";
    });
});

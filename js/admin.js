const API_URL = "https://695884716c3282d9f1d53041.mockapi.io/productos";

const form = document.getElementById("form-agregar-producto");
const tituloForm = form.querySelector("h2");

const nombreInput = document.getElementById("nombre");
const precioDiaInput = document.getElementById("precioDia");
const precio15Input = document.getElementById("precio15Dias");
const precio30Input = document.getElementById("precio30Dias");

const vpNombre = document.getElementById("vp-nombre");
const vpDia = document.getElementById("vp-dia");
const vp15 = document.getElementById("vp-15");
const vp30 = document.getElementById("vp-30");

const listaProductos = document.getElementById("lista-productos");

let productoEditandoId = null;

function actualizarVistaPrevia() {
    vpNombre.textContent = nombreInput.value || "Nombre del producto";
    vpDia.textContent = `$${precioDiaInput.value || 0}`;
    vp15.textContent = `$${precio15Input.value || 0}`;
    vp30.textContent = `$${precio30Input.value || 0}`;
}

nombreInput.addEventListener("input", actualizarVistaPrevia);
precioDiaInput.addEventListener("input", actualizarVistaPrevia);
precio15Input.addEventListener("input", actualizarVistaPrevia);
precio30Input.addEventListener("input", actualizarVistaPrevia);

actualizarVistaPrevia();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const producto = {
        nombre: nombreInput.value,
        precioDia: Number(precioDiaInput.value),
        precio15: Number(precio15Input.value),
        precio30: Number(precio30Input.value),
        estado: true
    };

    if (productoEditandoId) {
        fetch(`${API_URL}/${productoEditandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        })
            .then(res => res.json())
            .then(() => {
                Swal.fire({
                    title: "Producto modificado correctamente!",
                    icon: "success",
                    draggable: true
                });
                resetFormulario();
                cargarProductos();
            });
    }
    else {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        })
            .then(res => res.json())
            .then(() => {
                Swal.fire({
                    title: "Producto agregado correctamente!",
                    icon: "success",
                    draggable: true
                });
                resetFormulario();
                cargarProductos();
            });
    }
});

function resetFormulario() {
    form.reset();
    productoEditandoId = null;

    tituloForm.textContent = "Agregar nuevo producto";
    form.querySelector("input[type='submit']").value = "Agregar Producto";

    actualizarVistaPrevia();
}

function cargarProductos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(productos => {
            listaProductos.innerHTML = "";

            productos
                .filter(p => p.estado === true)
                .forEach(producto => {
                    const card = document.createElement("div");
                    card.classList.add("producto-admin-card");

                    card.innerHTML = `
                        <h3>${producto.nombre}</h3>
                        <p>Día: $${producto.precioDia}</p>
                        <p>15 días: $${producto.precio15}</p>
                        <p>30 días: $${producto.precio30}</p>
                        <button class="btn-modificar">Modificar</button>
                        <button class="btn-eliminar">Eliminar</button>
                    `;

                    card.querySelector(".btn-modificar").addEventListener("click", () => {
                        cargarEnFormulario(producto);
                    });

                    card.querySelector(".btn-eliminar").addEventListener("click", () => {
                        Swal.fire({
                            title: "¿Eliminar producto?",
                            text: "Esta acción no se puede deshacer",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Sí, eliminar",
                            cancelButtonText: "Cancelar"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                fetch(`${API_URL}/${producto.id}`, {
                                    method: "DELETE"
                                })
                                    .then(() => {
                                        Swal.fire({
                                            title: "Producto eliminado",
                                            icon: "success"
                                        });
                                        cargarProductos();
                                    });
                            }
                        });
                    });
                    listaProductos.appendChild(card);
                });
        });
}

cargarProductos();

function cargarEnFormulario(producto) {
    nombreInput.value = producto.nombre;
    precioDiaInput.value = producto.precioDia;
    precio15Input.value = producto.precio15;
    precio30Input.value = producto.precio30;

    productoEditandoId = producto.id;

    tituloForm.textContent = "Modificar producto";
    form.querySelector("input[type='submit']").value = "Guardar cambios";

    actualizarVistaPrevia();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

const API_ALQUILERES = "https://695884716c3282d9f1d53041.mockapi.io/alquileres";

const btnHistorial = document.getElementById("btn-historial");
const contenedorHistorial = document.getElementById("contenedor-historial");
const totalHistorial = document.getElementById("total-historial");
const btnVaciar = document.getElementById("btn-vaciar");
const btnOcultar = document.getElementById("btn-ocultar");

btnHistorial.addEventListener("click", () => {
    fetch(API_ALQUILERES)
        .then(res => res.json())
        .then(data => {
            const devueltos = data.filter(a => a.estado === "devuelto");

            contenedorHistorial.innerHTML = "";
            let sumaTotal = 0;

            devueltos.forEach(alquiler => {
                sumaTotal += Number(alquiler.total);

                const div = document.createElement("div");
                div.innerHTML = `
                    <p><strong>${alquiler.nombreProducto}</strong></p>
                    <p>Cliente: ${alquiler.cliente}</p>
                    <p>Fecha de Inicio: ${alquiler.fechaInicio}</p>
                    <p>Total: $${alquiler.total}</p>
                `;
                contenedorHistorial.appendChild(div);
            });

            totalHistorial.innerHTML = `<h3>Total acumulado: $${sumaTotal}</h3>`;
            btnOcultar.style.display = "block";
            btnVaciar.style.display = "block";

            if (devueltos.length === 0) {
                contenedorHistorial.innerHTML = "<p>No hay alquileres devueltos aún.</p>";
                totalHistorial.innerHTML = "";
                btnVaciar.style.display = "none";
                btnOcultar.style.display = "none";
            }
        });
        btnOcultar.addEventListener("click", () => {
            if (btnVaciar.style.display === "block") {
                contenedorHistorial.innerHTML = "";
                totalHistorial.innerHTML = "";
                btnVaciar.style.display = "none";
                btnOcultar.style.display = "none";
            }
    });
});

btnVaciar.addEventListener("click", () => {

    Swal.fire({
        title: "¿Vaciar historial?",
        text: "Se eliminarán todos los alquileres devueltos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((result) => {

        if (result.isConfirmed) {

            fetch(API_ALQUILERES)
                .then(res => res.json())
                .then(data => {

                    const devueltos = data.filter(a => a.estado === "devuelto");

                    const eliminaciones = devueltos.map(alquiler =>
                        fetch(`${API_ALQUILERES}/${alquiler.id}`, {
                            method: "DELETE"
                        })
                    );

                    return Promise.all(eliminaciones);
                })
                .then(() => {

                    contenedorHistorial.innerHTML = "";
                    totalHistorial.innerHTML = "";
                    btnVaciar.style.display = "none";
                    btnOcultar.style.display = "none";

                    Swal.fire({
                        icon: "success",
                        title: "Historial vaciado",
                        text: "Se eliminaron todos los registros correctamente",
                        timer: 2000,
                        showConfirmButton: false
                    });

                });
        }
    });
});
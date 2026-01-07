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
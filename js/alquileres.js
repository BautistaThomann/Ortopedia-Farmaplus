const API_ALQUILERES = "https://695884716c3282d9f1d53041.mockapi.io/alquileres";
const API_PRODUCTOS = "https://695884716c3282d9f1d53041.mockapi.io/productos";

const contenedor = document.getElementById("cont-productos-alquilados");

function cargarAlquileres() {
    fetch(API_ALQUILERES)
        .then(res => res.json())
        .then(alquileres => {

            contenedor.innerHTML = "";

            // SOLO ACTIVOS
            alquileres
                .filter(alquiler => alquiler.estado === "activo")
                .forEach(alquiler => {

                    const card = document.createElement("div");
                    card.classList.add("alquiler-card");

                    const hoy = new Date();
                    const fechaFin = new Date(alquiler.fechaFin);
                    const diff = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

                    let estado = "Óptimo";
                    let clase = "optimo";

                    if (diff <= 3 && diff > 0) {
                        estado = "Por vencer";
                        clase = "por-vencer";
                    } else if (diff <= 0) {
                        estado = "Vencido";
                        clase = "vencido";
                    }

                    card.innerHTML = `
                        <h3>${alquiler.nombreProducto}</h3>
                        <p><strong>Cliente:</strong> ${alquiler.cliente}</p>
                        <p><strong>Tel:</strong> ${alquiler.telefono}</p>
                        <p><strong>Días:</strong> ${alquiler.dias}</p>
                        <p><strong>Fecha inicio:</strong> ${alquiler.fechaInicio}</p>
                        <p><strong>Fecha fin:</strong> ${alquiler.fechaFin}</p>
                        <p><strong>Total:</strong> $${alquiler.total}</p>
                        <p class="estado ${clase}">${estado}</p>

                        <div class="acciones">
                            <button class="btn-imprimir">Imprimir</button>
                            <button class="btn-devuelto">Marcar devuelto</button>
                        </div>
                    `;

                    // IMPRIMIR
                    card.querySelector(".btn-imprimir").addEventListener("click", () => {
                        imprimirComprobante(alquiler);
                    });

                    // MARCAR DEVUELTO (YA NO BORRA)
                    card.querySelector(".btn-devuelto").addEventListener("click", () => {

                        Swal.fire({
                            title: "¿Marcar como devuelto?",
                            text: "El producto volverá a estar disponible",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Sí, marcar como devuelto",
                            cancelButtonText: "Cancelar"
                        }).then(result => {

                            if (result.isConfirmed) {

                                // PONER PRODUCTO DISPONIBLE
                                fetch(`${API_PRODUCTOS}/${alquiler.productoId}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ estado: true })
                                });

                                // ACTUALIZAR ALQUILER A DEVUELTO
                                fetch(`${API_ALQUILERES}/${alquiler.id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        ...alquiler,
                                        estado: "devuelto",
                                        fechaDevolucionReal: new Date().toISOString().split("T")[0]
                                    })
                                }).then(() => {

                                    Swal.fire({
                                        icon: "success",
                                        title: "Producto devuelto",
                                        timer: 1500,
                                        showConfirmButton: false
                                    });

                                    cargarAlquileres();
                                });
                            }
                        });
                    });

                    contenedor.appendChild(card);
                });
        })
        .catch(err => console.error(err));
}

function imprimirComprobante(datos) {

    const contenido = `
        <html>
        <head>
            <title>Comprobante de Alquiler</title>
            <style>
                body { 
                    font-family: Arial; 
                    padding: 20px; 
                }
                h2 { 
                    text-align: center; 
                }
                .col { 
                    width: 45%; 
                    display: inline-block; 
                    vertical-align: top; 
                }
                p { 
                    font-size: 15px; 
                    line-height: 1.5; 
                }
                hr { 
                    margin: 20px 0; 
                }
            </style>
        </head>
        <body>
            <h2>Comprobante de Alquiler</h2>

            <div class="col">
                <p><strong>Producto:</strong> ${datos.nombreProducto}</p>
                <p><strong>Cliente:</strong> ${datos.cliente}</p>
                <p><strong>Teléfono:</strong> ${datos.telefono}</p>
            </div>

            <div class="col">
                <p><strong>Días:</strong> ${datos.dias}</p>
                <p><strong>Fecha inicio:</strong> ${datos.fechaInicio}</p>
                <p><strong>Fecha devolución:</strong> ${datos.fechaFin}</p>
                <p><strong>Total:</strong> $${datos.total}</p>
            </div>

            <p>
                Me comprometo a cuidar el producto durante el período de alquiler y devolverlo
                en las mismas condiciones en las que lo recibí.
            </p>

            <br>
            <p><strong>Firma:</strong> ____________________________</p>

            <hr>
            <p>Gracias por confiar en nosotros | División Ortopedia <br> 
            <strong>Farmacia Farmaplus</strong></p>
        </body>
        </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(contenido);
    iframe.contentDocument.close();

    iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 500);
    };
}

cargarAlquileres();
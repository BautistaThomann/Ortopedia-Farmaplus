const contenedor = document.getElementById("cont-productos");

const URL = "https://695884716c3282d9f1d53041.mockapi.io/productos";

fetch(URL)
    .then(res => res.json())
    .then(productos => {
        contenedor.innerHTML = "";

        productos
        .sort((a, b) => 
                a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
            )
            .forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("producto-card");
            
            card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Día: <span>$${producto.precioDia}</span></p>
            <p>15 días: <span>$${producto.precio15}</span></p>
            <p>30 días: <span>$${producto.precio30}</span></p>
            <p class="estado ${producto.estado ? "disponible" : "alquilado"}">
            ${producto.estado ? "Disponible" : "Alquilado"}
            </p>
            
            <button 
            ${!producto.estado ? "disabled" : ""} 
            onclick="irAAlquiler('${producto.id}')">
            Alquilar
            </button>
            `;
            
            if (!producto.estado) {
                card.classList.add("alquilado");
            }
            contenedor.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error al cargar productos:", error);
    });

function irAAlquiler(idProducto) {
    window.location.href = `./html/form-alquileres.html?id=${idProducto}`;
}

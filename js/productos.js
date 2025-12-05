export const productos = [
    {
        nombre: "Bota Walker S",
        img: "../img/bota.png",
        porDia: 600,
        quinceDias: 9000,
        treintaDias: 17000
    },
    {
        nombre: "Bota Walker M",
        img: "../img/bota.png",
        porDia: 600,
        quinceDias: 9000,
        treintaDias: 17000
    },
    {
        nombre: "Bota Walker L",
        img: "../img/bota.png",
        porDia: 600,
        quinceDias: 9000,
        treintaDias: 17000
    },
    {
        nombre: "Bota Walker XL",
        img: "../img/bota.png",
        porDia: 600,
        quinceDias: 9000,
        treintaDias: 17000
    },
    {
        nombre: "Muleta Aluminio S",
        img: "../img/muletas.png",
        porDia: 866.67,
        quinceDias: 13000,
        treintaDias: 20000
    },
    {
        nombre: "Muleta Aluminio M",
        img: "../img/muletas.png",
        porDia: 866.67,
        quinceDias: 13000,
        treintaDias: 20000
    },
    {
        nombre: "Muleta Aluminio L",
        img: "../img/muletas.png",
        porDia: 866.67,
        quinceDias: 13000,
        treintaDias: 20000
    },
    {
        nombre: "Inmovilizador de Rodilla Larga",
        img: "../img/rodillera.png",
        porDia: 866.67,
        quinceDias: 13000,
        treintaDias: 20000
    },
    {
        nombre: "Inmovilizador de Rodilla Corta",
        img: "../img/rodillera.png",
        porDia: 866.67,
        quinceDias: 13000,
        treintaDias: 20000
    },
    {
        nombre: "Colchón Antiescaras",
        img: "../img/colchon-inflable.png",
        porDia: 1133.33,
        quinceDias: 17000,
        treintaDias: 29000
    },
    {
        nombre: "Cama Ortopédica Manual",
        img: "../img/camilla.png",
        porDia: null,
        quinceDias: null,
        treintaDias: 65000
    },
    {
        nombre: "Silla de Ruedas",
        img: "../img/silla-de-ruedas.png",
        porDia: 2000,
        quinceDias: 30000,
        treintaDias: 45000
    },
    {
        nombre: "Andador Tijera 1",
        img: "../img/andador.png",
        porDia: 733.33,
        quinceDias: 11000,
        treintaDias: 19000
    },
    {
        nombre: "Andador Tijera 2",
        img: "../img/andador.png",
        porDia: 733.33,
        quinceDias: 11000,
        treintaDias: 19000
    }
];

let productosAlquilados = JSON.parse(localStorage.getItem("productosAlquilados")) || [];

const contenedor = document.querySelector('.cont-productos');

if (contenedor) {
    productos.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('card');

        const estaAlquilado = productosAlquilados.includes(prod.nombre);


        card.innerHTML = `
            <img src="${prod.img}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>

            <p>Precio / día: ${prod.porDia ? `<strong style="font-weight: 560">$${prod.porDia}</strong>` : "—"}</p>
            <p>Precio / 15 días: ${prod.quinceDias ? `<strong style="font-weight: 560">$${prod.quinceDias}</strong>` : "—"}</p>
            <p>Precio / 30 días: ${prod.treintaDias ? `<strong style="font-weight: 560">$${prod.treintaDias}</strong>` : "—"}</p>

            <div class="cont-a">
                ${estaAlquilado
                ? `<button class="btn-alquilar" disabled style="background:#ccc;cursor:not-allowed">Alquilado</button>`
                : `<a href="./pages/form-alquiler.html?producto=${encodeURIComponent(prod.nombre)}" class="btn-alquilar">Alquilar</a>`
            }
            </div>
        `;

        contenedor.appendChild(card);
    });
}


export function actualizarEstadosProductos() {
    const productosAlquilados = JSON.parse(localStorage.getItem("productosAlquilados")) || [];

    const botones = document.querySelectorAll(".btn-alquilar");

    botones.forEach(boton => {
        const nombreProducto = boton.getAttribute("data-nombre");

        if (productosAlquilados.includes(nombreProducto)) {
            boton.textContent = "ALQUILADO";
            boton.disabled = true;
            boton.classList.add("disabled");
        } else {
            boton.textContent = "ALQUILAR";
            boton.disabled = false;
            boton.classList.remove("disabled");
        }
    });
}



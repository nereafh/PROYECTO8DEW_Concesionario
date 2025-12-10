
//localStorage.clear();

/*
function mostrarResultado(texto){
    document.getElementById("resultado").innerHTML = texto;
}

mostrarResultado("Texto a mostrar");

*/

const MARCAS = {
    BMW: {
        nombre: "BMW",
        coches: [
            { modelo: "BMW Serie 1", vendido: false },
            { modelo: "BMW Serie 2", vendido: false },
            { modelo: "BMW Serie 3", vendido: false },
            { modelo: "BMW Serie 4", vendido: false }
        ]
    },
    AUDI: {
        nombre: "AUDI",
        coches: [
            { modelo: "Audi A1", vendido: false },
            { modelo: "Audi A3", vendido: false },
            { modelo: "Audi A4", vendido: false },
            { modelo: "Audi A5", vendido: false }
        ]
    },
    // Expresiones regulares para validar el formulario
    regex: {
        nombre: /^[A-Za-zÁÉÍÓÚÑ ]{2,20}$/,
        apellidos: /^[A-Za-zÁÉÍÓÚÑ ]{2,30}$/,
        email: /^[\w.-]+@[\w.-]+\.\w+$/,
        telefono: /^[0-9]{9}$/,
        dni: /^[0-9]{8}[A-Za-z]$/
    }
};


let marcaSeleccionada = null; // marca actual (BMW o AUDI)
let cocheSeleccionado = null; // índice del coche seleccionado

// EVENTOS CLICK EN LOGOS
document.querySelector("#logoBMW").addEventListener("click", function(){ abrirMarca("BMW"); });
document.querySelector("#logoAUDI").addEventListener("click", function(){ abrirMarca("AUDI"); });


// Muestra los coches de la marca seleccionada
function abrirMarca(marca){
    marcaSeleccionada = marca;

    // Oculta pantalla inicial, d-none es una clase de Bootstrap
    document.querySelector("#homeInicio").classList.add("d-none");

    // Muestra sección coches
    document.querySelector("#seccionCoches").classList.remove("d-none");

    // Cambia título dinámico según marca
    document.querySelector("#tituloMarca").textContent = "Coches " + MARCAS[marca].nombre + " disponibles";

    // Muestra los coches
    mostrarCoches();
}


// FUNCION MOSTRAR COCHES
// Crea las tarjetas de coches dinámicamente
function mostrarCoches(){
    let lista = document.querySelector("#listaCoches");
    lista.innerHTML = ""; // limpiar contenido previo

    MARCAS[marcaSeleccionada].coches.forEach(function(car, index){
        let col = document.createElement("div");
        col.className = "col-md-3"; 

        let card = document.createElement("div");
        card.className = "card p-3 shadow-sm"; 
        card.innerHTML = "<h5 class='text-center'>" + car.modelo + "</h5>" +
                         "<p class='text-center fw-bold'>" + (car.vendido ? "VENDIDO" : "Disponible") + "</p>";

        // Solo se puede comprar si no está vendido
        if(!car.vendido){
            card.addEventListener("click", function(){ abrirFormulario(index); });
        }

        col.appendChild(card);
        lista.appendChild(col);
    });
}

// ABRIR FORMULARIO DE COMPRA
function abrirFormulario(indice){
    cocheSeleccionado = indice;

    // Oculta lista de coches
    document.querySelector("#seccionCoches").classList.add("d-none");

    // Muestra formulario
    document.querySelector("#formCompra").classList.remove("d-none");
}

// BOTÓN VOLVER FORMULARIO
document.querySelector("#volverForm").addEventListener("click", function(){
    document.querySelector("#formCompra").classList.add("d-none");
    document.querySelector("#seccionCoches").classList.remove("d-none");
});

// BOTÓN VOLVER INICIO
document.querySelector("#volverInicio").addEventListener("click", function(){
    document.querySelector("#seccionCoches").classList.add("d-none");
    document.querySelector("#formCompra").classList.add("d-none");
    document.querySelector("#homeInicio").classList.remove("d-none");
});

// FUNCION VALIDAR CAMPOS
// Cambia color del input según si es correcto o incorrecto
function validarCampo(idInput, idError, regex){
    let input = document.querySelector(idInput);
    let texto = input.value.trim();
    let error = document.querySelector(idError);

    if(!regex.test(texto)){
        input.classList.add("incorrecto");
        input.classList.remove("correcto");
        error.textContent = "Formato incorrecto";
        return false;
    }

    input.classList.add("correcto");
    input.classList.remove("incorrecto");
    error.textContent = "";
    return true;
}

// GUARDAR COMPRA
document.querySelector("#guardarCompra").addEventListener("click", function(){
    let r = MARCAS.regex;

    // Validar todos los campos
    let valido = validarCampo("#nombre","#errorNombre",r.nombre) &
                 validarCampo("#apellidos","#errorApellidos",r.apellidos) &
                 validarCampo("#email","#errorEmail",r.email) &
                 validarCampo("#telefono","#errorTelefono",r.telefono) &
                 validarCampo("#dni","#errorDNI",r.dni);

    if(!valido) return; // no guardar si hay errores

    // Marcar coche como vendido
    MARCAS[marcaSeleccionada].coches[cocheSeleccionado].vendido = true;

    // Ocultar formulario y mostrar lista de coches
    document.querySelector("#formCompra").classList.add("d-none");
    document.querySelector("#seccionCoches").classList.remove("d-none");

    // Actualizar visualización de coches
    mostrarCoches();
});

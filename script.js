
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
            { modelo: "BMW Serie 1", vendido: false, img: "img/bmw1.jpg" },
            { modelo: "BMW Serie 2", vendido: false, img: "img/bmw2.jpg" },
            { modelo: "BMW Serie 3", vendido: false },
            { modelo: "BMW Serie 4", vendido: false }
        ]
    },
    AUDI: {
        nombre: "AUDI",
        coches: [
            { modelo: "Audi A1", vendido: false,  img: "img/a1.jpg" },
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

        // Imagen del coche (si existe)
        if(car.img){
            let img = document.createElement("img");
            img.src = car.img;
            img.className = "card-img-top mb-2";
            img.style.height = "150px";
            img.style.objectFit = "cover";
            card.appendChild(img);
        }

        // Nombre del coche
        let nombre = document.createElement("h5");
        nombre.textContent = car.modelo;
        nombre.className = "text-center";
        card.appendChild(nombre);

        // Estado del coche
        let estado = document.createElement("p");
        estado.textContent = car.vendido ? "VENDIDO" : "Disponible";
        estado.className = "text-center fw-bold";
        card.appendChild(estado);

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

const BASE_API = "php/";

 marcaSeleccionada = null;
 cocheSeleccionado = null;

// Carrito guardado en localStorage
function getCarrito() { return JSON.parse(localStorage.getItem("carrito")) || []; }
function setCarrito(c) { localStorage.setItem("carrito", JSON.stringify(c)); actualizarContador(); }
function agregarAlCarrito(cocheId) { let c = getCarrito(); c.push(cocheId); setCarrito(c); }
function eliminarDelCarrito(index){ let c=getCarrito(); c.splice(index,1); setCarrito(c); renderCarrito(); }
function actualizarContador(){ document.getElementById("contadorCarrito").textContent=getCarrito().length; }

// Mostrar coches
function mostrarCochesDB(marca, coches){
  let lista=document.getElementById("listaCoches");
  lista.innerHTML="";
  coches.forEach(c=>{
    let col=document.createElement("div"); col.className="col-md-3";
    let card=document.createElement("div"); card.className="card p-3 shadow-sm";
    card.innerHTML=`<h5 class="text-center">${c.modelo}</h5><p class="text-center fw-bold">${c.vendido ? "VENDIDO":"Disponible"}</p>`;
    if(!c.vendido) card.addEventListener("click",()=>abrirDetalleCoche(c));
    col.appendChild(card); lista.appendChild(col);
  });
}

// Abrir detalle coche
function abrirDetalleCoche(coche){
  document.getElementById("ventanaCoche").classList.remove("d-none");
  document.getElementById("tituloCoche").textContent=coche.modelo;
  document.getElementById("precioCoche").textContent="€ "+coche.precio;
  document.getElementById("btnAgregarCarritoCoche").onclick=()=>{ agregarAlCarrito(coche.id); document.getElementById("ventanaCoche").classList.add("d-none"); };
}




// Abrir ventanas
document.getElementById("btnLogin").addEventListener("click", ()=> {
    document.getElementById("ventanaLogin").classList.remove("d-none");
});
document.getElementById("btnRegistro").addEventListener("click", ()=> {
    document.getElementById("ventanaRegistro").classList.remove("d-none");
});
document.getElementById("btnCarrito").addEventListener("click", ()=> {
    renderCarrito(); // función que muestra el carrito
    document.getElementById("ventanaCarrito").classList.remove("d-none");
});

// Cerrar ventanas
document.getElementById("closeVentanaLogin").addEventListener("click", ()=> {
    document.getElementById("ventanaLogin").classList.add("d-none");
});
document.getElementById("closeVentanaRegistro").addEventListener("click", ()=> {
    document.getElementById("ventanaRegistro").classList.add("d-none");
});
document.getElementById("closeVentanaCarrito").addEventListener("click", ()=> {
    document.getElementById("ventanaCarrito").classList.add("d-none");
});
document.getElementById("closeVentanaCoche").addEventListener("click", ()=> {
    document.getElementById("ventanaCoche").classList.add("d-none");
});




function renderCarrito(){
    let lista=document.getElementById("listaCarrito");
    lista.innerHTML="";
    let carrito=getCarrito();
    if(carrito.length===0){
        lista.innerHTML="<li class='list-group-item'>Carrito vacío</li>";
        return;
    }
    carrito.forEach((cocheId,index)=>{
        let item=document.createElement("li");
        item.className="list-group-item d-flex justify-content-between align-items-center";
        item.textContent=cocheId; // temporal: más adelante puedes mostrar modelo real
        let btn=document.createElement("button");
        btn.className="btn btn-sm btn-danger";
        btn.textContent="X";
        btn.onclick=()=>eliminarDelCarrito(index);
        item.appendChild(btn);
        lista.appendChild(item);
    });
}

// Vaciar carrito
document.getElementById("btnVaciarCarrito").addEventListener("click", ()=>{
    setCarrito([]);
    renderCarrito();
});

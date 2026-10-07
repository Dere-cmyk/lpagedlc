// ==========================================================
// Landing Experto en E-commerce · UCB Tarija
// JavaScript mínimo: líneas de fecha, barra fija y registro del toque.
// ==========================================================

// Enlaces de WhatsApp: uno para inscripciones abiertas y otro para después del cierre
var enlaceInscripcion = "https://wa.me/59169328230?text=Hola%2C%20quiero%20inscribirme%20al%20curso%20Experto%20en%20E-commerce%20del%2016%20de%20noviembre.";
var enlaceProximaVersion = "https://wa.me/59169328230?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20la%20pr%C3%B3xima%20versi%C3%B3n%20del%20curso%20Experto%20en%20E-commerce.";

var textoBotonInscripcion = "Reserva tu cupo por WhatsApp";
var textoBotonProximaVersion = "Pregunta por la próxima versión";

// Cierre de inscripciones (supuesto): domingo 15 de noviembre de 2026
var anioCierre = 2026;
var mesCierre = 10; // en JavaScript los meses empiezan en 0, así que noviembre es 10
var diaCierre = 15;

// El conteo de días solo aparece en las últimas dos semanas
var diasParaMostrarConteo = 14;

var milisegundosPorDia = 24 * 60 * 60 * 1000;
var milisegundosPorHora = 60 * 60 * 1000;
var desfaseBolivia = 4; // Bolivia está en UTC-4 y no cambia de hora en verano


// ---------- Cálculo de días que faltan ----------

// Devuelve cuántos días faltan para el cierre según la fecha de Bolivia
function calcularDiasFaltantes() {
  var ahoraEnMilisegundos = Date.now();
  var restaDelDesfase = desfaseBolivia * milisegundosPorHora;
  var ahoraBolivia = new Date(ahoraEnMilisegundos - restaDelDesfase);

  // Se usa UTC porque ya restamos el desfase a mano
  var anioHoy = ahoraBolivia.getUTCFullYear();
  var mesHoy = ahoraBolivia.getUTCMonth();
  var diaHoy = ahoraBolivia.getUTCDate();

  var hoyEnMilisegundos = Date.UTC(anioHoy, mesHoy, diaHoy);
  var cierreEnMilisegundos = Date.UTC(anioCierre, mesCierre, diaCierre);

  var diferencia = cierreEnMilisegundos - hoyEnMilisegundos;
  var diasFaltantes = diferencia / milisegundosPorDia;
  return diasFaltantes;
}

// Elige el texto de la primera línea de fecha según los días que faltan
function elegirPrimeraLinea(diasFaltantes) {
  var textoLinea = "Inscripciones hasta el domingo 15 de noviembre";

  if (diasFaltantes == 1) {
    textoLinea = "Inscripciones hasta mañana, domingo 15 de noviembre";
  }

  if (diasFaltantes == 0) {
    textoLinea = "Hoy cierran las inscripciones";
  }

  if (diasFaltantes < 0) {
    // El punto medio se quita para que nunca quede colgando al final de una línea
    textoLinea = "Inscripciones cerradas";
  }

  return textoLinea;
}

// La segunda línea es el conteo (de 2 a 14 días) o el aviso de la próxima versión (ya cerrado)
function elegirSegundaLinea(diasFaltantes) {
  var textoLinea = "";

  if (diasFaltantes >= 2) {
    if (diasFaltantes <= diasParaMostrarConteo) {
      textoLinea = "Faltan " + diasFaltantes + " días";
    }
  }

  if (diasFaltantes < 0) {
    textoLinea = "escríbenos para la próxima versión";
  }

  return textoLinea;
}

// Actualiza las líneas de fecha, el texto del botón y el enlace en toda la página
function actualizarOferta() {
  var diasFaltantes = calcularDiasFaltantes();
  var inscripcionesCerradas = diasFaltantes < 0;
  var primeraLinea = elegirPrimeraLinea(diasFaltantes);
  var segundaLinea = elegirSegundaLinea(diasFaltantes);

  var lineasDeFecha = document.querySelectorAll("[data-linea-fecha]");
  for (var posicionLinea = 0; posicionLinea < lineasDeFecha.length; posicionLinea++) {
    lineasDeFecha[posicionLinea].textContent = primeraLinea;
  }

  var lineasDeConteo = document.querySelectorAll("[data-linea-conteo]");
  for (var posicionConteo = 0; posicionConteo < lineasDeConteo.length; posicionConteo++) {
    var lineaDeConteo = lineasDeConteo[posicionConteo];
    lineaDeConteo.textContent = segundaLinea;

    // Si no hay segunda línea, el elemento se oculta para no dejar un hueco
    if (segundaLinea == "") {
      lineaDeConteo.hidden = true;
    } else {
      lineaDeConteo.hidden = false;
    }
  }

  // El botón y el enlace dependen de si las inscripciones siguen abiertas
  var enlaceElegido = enlaceInscripcion;
  var textoBotonElegido = textoBotonInscripcion;
  if (inscripcionesCerradas == true) {
    enlaceElegido = enlaceProximaVersion;
    textoBotonElegido = textoBotonProximaVersion;
  }

  var botones = document.querySelectorAll("[data-evento]");
  for (var posicionBoton = 0; posicionBoton < botones.length; posicionBoton++) {
    var botonActual = botones[posicionBoton];
    botonActual.href = enlaceElegido;

    var textoDelBoton = botonActual.querySelector(".boton-whatsapp__texto");
    textoDelBoton.textContent = textoBotonElegido;
  }
}


// ---------- Registro del toque en el botón ----------

// Guarda en la consola dónde tocó la persona. Es la microconversión de la página.
function registrarToque(evento) {
  var botonTocado = evento.currentTarget;
  var nombreEvento = botonTocado.getAttribute("data-evento");
  var ubicacionBoton = botonTocado.getAttribute("data-ubicacion");

  console.log("Evento:", nombreEvento, "· Ubicación:", ubicacionBoton);

  // Aquí iría el evento de GA4, por ejemplo:
  // gtag("event", nombreEvento, { ubicacion: ubicacionBoton });
}

function activarRegistroDeToques() {
  var botones = document.querySelectorAll("[data-evento]");
  for (var posicionBoton = 0; posicionBoton < botones.length; posicionBoton++) {
    botones[posicionBoton].addEventListener("click", registrarToque);
  }
}


// ---------- Barra fija inferior ----------

var botonPrincipalFueraDePantalla = false;
var botonCierreVisible = false;

// Muestra la barra solo si el botón principal ya salió por arriba y el del cierre aún no se ve
function actualizarBarraFija() {
  var barraFija = document.getElementById("barra-fija");
  var botonDeLaBarra = barraFija.querySelector("a");

  var debeMostrarse = false;
  if (botonPrincipalFueraDePantalla == true) {
    if (botonCierreVisible == false) {
      debeMostrarse = true;
    }
  }

  if (debeMostrarse == true) {
    barraFija.classList.add("barra-fija--visible");
    barraFija.setAttribute("aria-hidden", "false");
    botonDeLaBarra.removeAttribute("tabindex");
  } else {
    barraFija.classList.remove("barra-fija--visible");
    barraFija.setAttribute("aria-hidden", "true");
    botonDeLaBarra.setAttribute("tabindex", "-1");
  }
}

function alCambiarBotonPrincipal(entradas) {
  var entrada = entradas[0];
  var estaVisible = entrada.isIntersecting;
  var estaArriba = entrada.boundingClientRect.top < 0;

  // Solo cuenta como "fuera" si salió por arriba, no por abajo
  if (estaVisible == false && estaArriba == true) {
    botonPrincipalFueraDePantalla = true;
  } else {
    botonPrincipalFueraDePantalla = false;
  }

  actualizarBarraFija();
}

function alCambiarBotonCierre(entradas) {
  var entrada = entradas[0];
  botonCierreVisible = entrada.isIntersecting;
  actualizarBarraFija();
}

function activarBarraFija() {
  var navegadorSoportaObservador = "IntersectionObserver" in window;
  if (navegadorSoportaObservador == false) {
    return;
  }

  var botonPrincipal = document.getElementById("boton-principal");
  var botonCierre = document.getElementById("boton-cierre");

  var observadorPrincipal = new IntersectionObserver(alCambiarBotonPrincipal);
  observadorPrincipal.observe(botonPrincipal);

  var observadorCierre = new IntersectionObserver(alCambiarBotonCierre);
  observadorCierre.observe(botonCierre);
}


// ---------- Arranque ----------
actualizarOferta();
activarRegistroDeToques();
activarBarraFija();

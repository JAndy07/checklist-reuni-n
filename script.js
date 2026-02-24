// --- CONFIGURACIÓN ---
const PASSWORD_CORRECTA = "24148318"; 

const DATOS = {
  acomodador: [
    { texto: "Observar ventilación", momento: "Antes de la reunión" },
    { texto: "Aires acondicionados: Apagados", momento: "Al irse del salón" },
    { texto: "Puertas y ventanas cerradas", momento: "Al irse del salón" },
    { texto: "Fichas de tensión - Bajar sólo las verdes", momento: "Al irse del salón" },
    { texto: "Audio y video: TV apagadas", momento: "Al irse del salón" }
  ],
  plataforma: [
    { texto: "Llevar el agua", momento: "Antes de empezar la reunión" },
    { texto: "Preguntar a los hermanos sobre participaciones", momento: "Antes de empezar (Jueves)" },
    { texto: "Acomodar plataforma", momento: "Antes de empezar la reunión" },
    { texto: "Acomodar la jirafa para el lector", momento: "Antes de empezar la reunión" }
  ]
};

// Referencias
const pantallaLogin = document.getElementById('pantalla-login');
const pantallaSelector = document.getElementById('rol-selector');
const pantallaLista = document.getElementById('lista-tareas');
const pantallaEmergencias = document.getElementById('pantalla-emergencias');
const contenedorTareas = document.getElementById('contenedor-tareas');
const header = document.getElementById('main-header');
const tituloPrincipal = document.getElementById('titulo-principal');
const subtitulo = document.getElementById('subtitulo');
const errorMsg = document.getElementById('error-msg');

// --- SISTEMA DE LOGIN ---
window.onload = function() {
  if (localStorage.getItem('acceso_concedido') === 'true') {
    mostrarApp();
  }
};

function verificarPassword() {
  const input = document.getElementById('input-pass').value;
  if (input === PASSWORD_CORRECTA) {
    localStorage.setItem('acceso_concedido', 'true');
    mostrarApp();
  } else {
    errorMsg.textContent = "Contraseña incorrecta ❌";
    setTimeout(() => { errorMsg.textContent = ""; }, 2000);
  }
}

function verificarEnter(event) {
  if (event.key === "Enter") verificarPassword();
}

function mostrarApp() {
  pantallaLogin.classList.remove('activa');
  pantallaSelector.classList.add('activa');
  header.style.display = 'block';
  // Reemplazamos el historial actual para que sea la "base"
  history.replaceState({view: 'menu'}, 'Menu', '#menu');
}

// --- GESTIÓN DEL HISTORIAL (Gesto de volver) ---
window.onpopstate = function(event) {
  // Cuando el usuario hace el gesto "atrás", volvemos al menú
  // Ocultamos todas las pantallas secundarias
  pantallaLista.classList.remove('activa');
  pantallaEmergencias.classList.remove('activa');

  // Mostramos el selector principal
  pantallaSelector.classList.add('activa');
  tituloPrincipal.textContent = "✨ Reunión";
  subtitulo.style.display = "block";
};

// --- NAVEGACIÓN ---

function abrirEmergencias() {
  // Agregamos un estado al historial para que el gesto "atrás" funcione
  history.pushState({view: 'emergencias'}, 'Emergencias', '#emergencias');

  pantallaSelector.classList.remove('activa');
  pantallaEmergencias.classList.add('activa');
  tituloPrincipal.textContent = "Emergencias";
  subtitulo.style.display = "none";
}

function seleccionarRol(rol) {
  // Agregamos un estado al historial
  history.pushState({view: 'lista'}, 'Lista', '#lista');

  pantallaSelector.classList.remove('activa');
  pantallaLista.classList.add('activa');

  const nombreRol = rol.charAt(0).toUpperCase() + rol.slice(1);
  tituloPrincipal.textContent = nombreRol;
  subtitulo.style.display = 'none';

  generarLista(rol);
}

// Nota: Ya no necesitamos las funciones "volver()" o "cerrarEmergencias()" 
// porque los botones ahora llaman a window.history.back(), 
// lo cual dispara el evento window.onpopstate de arriba.

function generarLista(rol) {
  contenedorTareas.innerHTML = "";
  const tareas = DATOS[rol];

  const grupos = {};
  tareas.forEach(t => {
    if (!grupos[t.momento]) grupos[t.momento] = [];
    grupos[t.momento].push(t);
  });

  for (const momento in grupos) {
    const divMomento = document.createElement('div');
    divMomento.className = 'grupo-momento';
    divMomento.innerHTML = `<div class="titulo-momento">${momento}</div>`;

    grupos[momento].forEach(tarea => {
      const label = document.createElement('label');
      label.className = 'tarea-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      checkbox.onchange = function() {
        if(this.checked) label.classList.add('completada');
        else label.classList.remove('completada');
      };

      const texto = document.createElement('span');
      texto.textContent = tarea.texto;

      label.appendChild(checkbox);
      label.appendChild(texto);
      divMomento.appendChild(label);
    });

    contenedorTareas.appendChild(divMomento);
  }
}

function limpiarTodo() {
  const checks = document.querySelectorAll('input[type="checkbox"]');
  checks.forEach(c => {
    c.checked = false;
    c.parentNode.classList.remove('completada');
  });
}
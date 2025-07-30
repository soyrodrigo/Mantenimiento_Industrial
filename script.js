const menuItems = document.querySelectorAll('.menu li');
const sections = document.querySelectorAll('section');
const sidebar = document.querySelector('.sidebar');

// Mobile toggle
const mobileToggle = document.createElement('div');
mobileToggle.classList.add('mobile-toggle');
mobileToggle.innerHTML = '<i class="fa fa-bars"></i>';
document.body.appendChild(mobileToggle);
mobileToggle.addEventListener('click', () => sidebar.classList.toggle('show'));

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const sectionId = item.getAttribute('data-section');
        sections.forEach(sec => {
            sec.classList.toggle('active', sec.id === sectionId);
        });
        if (window.innerWidth <= 768) sidebar.classList.remove('show');
    });
});

function saveLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function getLocal(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Equipos
const equipoForm = document.getElementById('equipo-form');
const listaEquipos = document.getElementById('lista-equipos');

function renderEquipos() {
    const equipos = getLocal('equipos');
    listaEquipos.innerHTML = '';
    equipos.forEach((eq, index) => {
        const li = document.createElement('li');
        li.textContent = `${eq.nombre} - ${eq.descripcion}`;
        listaEquipos.appendChild(li);
    });
    document.getElementById('total-equipos').textContent = `${equipos.length} Equipos`;
}

equipoForm.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('equipo-nombre').value;
    const descripcion = document.getElementById('equipo-descripcion').value;
    const equipos = getLocal('equipos');
    equipos.push({ nombre, descripcion });
    saveLocal('equipos', equipos);
    equipoForm.reset();
    renderEquipos();
});

// Tareas
const tareaForm = document.getElementById('tarea-form');
const listaTareas = document.getElementById('lista-tareas');

function renderTareas() {
    const tareas = getLocal('tareas');
    listaTareas.innerHTML = '';
    tareas.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.fecha} - ${t.descripcion}`;
        listaTareas.appendChild(li);
    });
    document.getElementById('tareas-programadas').textContent = `${tareas.length} Tareas`;
}

tareaForm.addEventListener('submit', e => {
    e.preventDefault();
    const fecha = document.getElementById('tarea-fecha').value;
    const descripcion = document.getElementById('tarea-descripcion').value;
    const tareas = getLocal('tareas');
    tareas.push({ fecha, descripcion });
    saveLocal('tareas', tareas);
    tareaForm.reset();
    renderTareas();
});

// Ordenes de Trabajo
const otForm = document.getElementById('ot-form');
const listaOT = document.getElementById('lista-ot');

function renderOT() {
    const ordenes = getLocal('ots');
    listaOT.innerHTML = '';
    ordenes.forEach(o => {
        const li = document.createElement('li');
        li.textContent = o.descripcion;
        listaOT.appendChild(li);
    });
    document.getElementById('ot-abiertas').textContent = `${ordenes.length} OT Abiertas`;
}

otForm.addEventListener('submit', e => {
    e.preventDefault();
    const descripcion = document.getElementById('ot-descripcion').value;
    const ordenes = getLocal('ots');
    ordenes.push({ descripcion });
    saveLocal('ots', ordenes);
    otForm.reset();
    renderOT();
});

// Búsqueda
const buscador = document.getElementById('buscador');
const resultados = document.getElementById('resultados');

buscador.addEventListener('input', () => {
    const equipos = getLocal('equipos');
    const q = buscador.value.toLowerCase();
    resultados.innerHTML = '';
    equipos.filter(e => e.nombre.toLowerCase().includes(q)).forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.nombre} - ${e.descripcion}`;
        resultados.appendChild(li);
    });
});

// Respaldos
const crearBackupBtn = document.getElementById('crear-backup');
const restaurarBackupInput = document.getElementById('restaurar-backup');

crearBackupBtn.addEventListener('click', () => {
    const data = {
        equipos: getLocal('equipos'),
        tareas: getLocal('tareas'),
        ots: getLocal('ots')
    };
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    a.click();
    URL.revokeObjectURL(url);
});

restaurarBackupInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        const data = JSON.parse(evt.target.result);
        saveLocal('equipos', data.equipos || []);
        saveLocal('tareas', data.tareas || []);
        saveLocal('ots', data.ots || []);
        renderEquipos();
        renderTareas();
        renderOT();
    };
    reader.readAsText(file);
});

// Inicializar
renderEquipos();
renderTareas();
renderOT();

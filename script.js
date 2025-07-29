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
        sections.forEach(sec => sec.classList.toggle('active', sec.id === sectionId));
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
const tareaEquipo = document.getElementById('tarea-equipo');
const otEquipo = document.getElementById('ot-equipo');
const clEquipo = document.getElementById('cl-equipo');

function renderEquipoOptions() {
    const equipos = getLocal('equipos');
    [tareaEquipo, otEquipo, clEquipo].forEach(sel => {
        sel.innerHTML = '';
        equipos.forEach((eq, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = eq.nombre;
            sel.appendChild(opt);
        });
    });
}

function renderEquipos() {
    const equipos = getLocal('equipos');
    listaEquipos.innerHTML = '';
    equipos.forEach((eq, index) => {
        const li = document.createElement('li');
        li.textContent = `${eq.nombre} (${eq.marca || ''} ${eq.modelo || ''})`;
        listaEquipos.appendChild(li);
    });
    document.getElementById('total-equipos').textContent = `${equipos.length} Equipos`;
    renderEquipoOptions();
}

equipoForm.addEventListener('submit', e => {
    e.preventDefault();
    const nuevo = {
        nombre: document.getElementById('equipo-nombre').value,
        marca: document.getElementById('equipo-marca').value,
        modelo: document.getElementById('equipo-modelo').value,
        anio: document.getElementById('equipo-anio').value,
        area: document.getElementById('equipo-area').value,
        potencia: document.getElementById('equipo-potencia').value,
        tipo: document.getElementById('equipo-tipo').value,
        obs: document.getElementById('equipo-obs').value
    };
    const equipos = getLocal('equipos');
    equipos.push(nuevo);
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
        li.textContent = `${t.fecha} - ${t.equipo} - ${t.descripcion} (${t.frecuencia})`;
        listaTareas.appendChild(li);
    });
    document.getElementById('tareas-programadas').textContent = `${tareas.length} Tareas`;
}

tareaForm.addEventListener('submit', e => {
    e.preventDefault();
    const equipos = getLocal('equipos');
    if (!equipos.length) return;
    const tarea = {
        equipo: equipos[tareaEquipo.value]?.nombre || '',
        fecha: document.getElementById('tarea-fecha').value,
        descripcion: document.getElementById('tarea-descripcion').value,
        frecuencia: document.getElementById('tarea-frecuencia').value
    };
    const tareas = getLocal('tareas');
    tareas.push(tarea);
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
        li.textContent = `${o.fecha} - ${o.equipo} - ${o.persona} - ${o.descripcion}`;
        listaOT.appendChild(li);
    });
    document.getElementById('ot-abiertas').textContent = `${ordenes.length} OT Abiertas`;
}

otForm.addEventListener('submit', e => {
    e.preventDefault();
    const equipos = getLocal('equipos');
    if (!equipos.length) return;
    const orden = {
        equipo: equipos[otEquipo.value]?.nombre || '',
        persona: document.getElementById('ot-persona').value,
        fecha: document.getElementById('ot-fecha').value,
        descripcion: document.getElementById('ot-descripcion').value
    };
    const ordenes = getLocal('ots');
    ordenes.push(orden);
    saveLocal('ots', ordenes);
    otForm.reset();
    renderOT();
});

// Check List
const clForm = document.getElementById('cl-form');
const clLista = document.getElementById('cl-lista');

function renderCheckList() {
    const data = getLocal('checklist');
    const equipos = getLocal('equipos');
    const eqIndex = clEquipo.value;
    clLista.innerHTML = '';
    if (equipos[eqIndex]) {
        const partes = data[equipos[eqIndex].nombre] || [];
        partes.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            clLista.appendChild(li);
        });
    }
}

clEquipo.addEventListener('change', renderCheckList);

clForm.addEventListener('submit', e => {
    e.preventDefault();
    const equipos = getLocal('equipos');
    if (!equipos.length) return;
    const eqName = equipos[clEquipo.value].nombre;
    const data = getLocal('checklist');
    data[eqName] = data[eqName] || [];
    data[eqName].push(document.getElementById('cl-parte').value);
    saveLocal('checklist', data);
    clForm.reset();
    renderCheckList();
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
        li.textContent = `${e.nombre} (${e.marca || ''} ${e.modelo || ''})`;
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
        ots: getLocal('ots'),
        checklist: getLocal('checklist')
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
        saveLocal('checklist', data.checklist || {});
        renderEquipos();
        renderTareas();
        renderOT();
        renderCheckList();
    };
    reader.readAsText(file);
});

// Inicializar
renderEquipos();
renderTareas();
renderOT();
renderCheckList();

const input = document.getElementById('fileInput');
const statusEl = document.getElementById('status');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const dropzone = document.getElementById('dropzone');

function humanSize(bytes){
const units = ['B','KB','MB','GB'];
let u = 0, n = bytes;
while(n >= 1024 && u < units.length-1){ n/=1024; u++; }
return `${n.toFixed(n<10?2:0)} ${units[u]}`;
}

function resetUI(){
preview.hidden = true; preview.innerHTML = '';
statusEl.innerHTML = 'Aún no se seleccionó ningún archivo.';
clearBtn.disabled = true;
input.value = '';
}

function validateAndShow(file){
if(!file){ resetUI(); return; }
if(!file.type || !file.type.startsWith('image/')){
resetUI();
statusEl.innerHTML = `<span class="err">Error:</span> el archivo seleccionado no es una imagen (tipo: ${file.type || 'desconocido'}).`;
return;
}
const MAX = 5 * 1024 * 1024;
if(file.size > MAX){
resetUI();
statusEl.innerHTML = `<span class="err">Error:</span> la imagen supera el límite de 5 MB (${humanSize(file.size)}).`;
return;
}

const reader = new FileReader();
reader.onload = e => {
const url = e.target.result;
const fig = document.createElement('figure');
const img = document.createElement('img');
img.alt = `Vista previa de ${file.name}`;
img.src = url;

const meta = document.createElement('div');
meta.className = 'meta';
meta.innerHTML = `
    <p><strong>Nombre:</strong> ${file.name}</p>
    <p><strong>Tipo MIME:</strong> ${file.type}</p>
    <p><strong>Tamaño:</strong> ${humanSize(file.size)}</p>
    <p><strong>Última modificación:</strong> ${new Date(file.lastModified).toLocaleString()}</p>
`;

fig.appendChild(img);
fig.appendChild(meta);
preview.innerHTML = '';
preview.appendChild(fig);
preview.hidden = false;
statusEl.innerHTML = `<span class="ok">Listo:</span> imagen válida previsualizada en el documento.`;
clearBtn.disabled = false;
};
reader.onerror = () => {
resetUI();
statusEl.innerHTML = `<span class="err">Error:</span> no se pudo leer el archivo.`;
};
reader.readAsDataURL(file);
}

input.addEventListener('change', () => validateAndShow(input.files[0]));
clearBtn.addEventListener('click', resetUI);

['dragenter','dragover'].forEach(evt => dropzone.addEventListener(evt, e=>{
e.preventDefault(); e.stopPropagation(); dropzone.classList.add('drag');
}));
['dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, e=>{
e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('drag');
}));
dropzone.addEventListener('drop', e => {
const file = e.dataTransfer.files && e.dataTransfer.files[0];
validateAndShow(file);
});

window.addEventListener('paste', e => {
const item = [...(e.clipboardData?.items||[])].find(i => i.type.startsWith('image/'));
if(item){ validateAndShow(item.getAsFile()); }
});

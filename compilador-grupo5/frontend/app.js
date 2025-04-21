
document.getElementById('code').addEventListener('input', () => {
    const code = document.getElementById('code').value;
    fetch('http://localhost:3000/analizar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
        .then(res => res.json())
        .then(data => {
            const output = document.getElementById('statusbar');
            if (data.success) {
                output.textContent = '';
            } else {
                output.textContent = `❌ ${data.message}`;
            }
        })
        .catch(err => {
            console.error('Error de conexión:', err);
        });
});

function descargarPDF(tokens, ast, intermediate) {
    fetch('http://localhost:3000/generar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens, ast, intermediate })
    })
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'informe_compilador.pdf';
            link.click();
        })
        .catch(error => {
            console.error('Error generando PDF:', error);
        });
}

function ejecutarCodigo() {
    const code = document.getElementById('code').value;

    if (code.trim() === '') {
        document.getElementById('output').textContent = 'No hay código para ejecutar.';
    } else {
        document.getElementById('output').textContent = 'Ejecutando código...\n' + code;
    }
}

function limpiarCodigo() {
    document.getElementById("code").value = "";
    document.getElementById("output").innerHTML = "Consola de salida...";
}

function mostrarInstrucciones() {
    document.getElementById('modal-instrucciones').classList.remove('hidden');
}

function cerrarInstrucciones() {
    document.getElementById('modal-instrucciones').classList.add('hidden');
}

const textarea = document.getElementById('code');
const lineNumbers = document.getElementById('line-numbers');

function updateLineNumbers() {
    const lineCount = textarea.value.split('\n').length;
    const totalLines = Math.max(30, lineCount); // mínimo 30 líneas

    lineNumbers.innerHTML = '';
    for (let i = 1; i <= totalLines; i++) {
        lineNumbers.innerHTML += i + '<br>';
    }
}

// Escuchar eventos relevantes
textarea.addEventListener('input', updateLineNumbers);
textarea.addEventListener('keydown', updateLineNumbers);
textarea.addEventListener('keyup', updateLineNumbers);
textarea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textarea.scrollTop;
});

// Inicializar
updateLineNumbers();
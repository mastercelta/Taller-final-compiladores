
let astImageBase64 = null;

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
            const btnPDF = document.getElementById('btn-descargar-pdf');

            if (data.success) {
                output.textContent = '';
                btnPDF.disabled = false;
            } else {
                output.textContent = `❌ ${data.message}`;
                btnPDF.disabled = true;
            }
        })
        .catch(err => {
            console.error('Error de conexión:', err);
        });
});

function descargarPDF(tokens, ast, intermediate) {
    const code = document.getElementById('code').value;
    fetch('http://localhost:3000/generar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, astImageBase64 })

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

    if (!code) {
        alert("Por favor, ingresa código para ejecutar.");
        return;
    }

    fetch('http://localhost:3000/ejecutar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
        .then(res => res.json())
        .then(data => {
            const output = document.getElementById('output');
            const btnArbol = document.getElementById('mostrar-arbol');

            if (data.success) {
                output.innerHTML = data.output.replace(/\\n/g, '<br>');
                generarImagenArbol();
                btnArbol.classList.remove('hidden');
            } else {
                output.textContent = '❌ ' + data.error;
                btnArbol.classList.add('hidden');
            }
        })
        .catch(err => {
            console.error('Error al ejecutar código:', err);
        });
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

// === Parser ===
function parsearCodigo(codigo) {
    const lineas = codigo
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");

    const programa = { nombre: "Program", hijos: [] };

    for (let linea of lineas) {
        if (linea.startsWith("def ") && linea.endsWith(";")) {
            const contenido = linea.slice(4, -1).trim();
            const partes = contenido.split(" igual ");
            if (partes.length !== 2) {
                programa.hijos.push({
                    nombre: "Error",
                    hijos: [{ nombre: `Sintaxis inválida en def: ${linea}` }]
                });
                continue;
            }
            programa.hijos.push({
                nombre: "S",
                hijos: [
                    { nombre: `id (${partes[0].trim()})` },
                    {
                        nombre: "E",
                        hijos: [
                            { nombre: "T", hijos: procesarExpresion(partes[1].trim()) }
                        ]
                    }
                ]
            });
        } else if (linea.startsWith("mostrar ") && linea.endsWith(";")) {
            const expr = linea.slice(8, -1).trim();
            programa.hijos.push({
                nombre: "Mostrar",
                hijos: [
                    { nombre: "E", hijos: [{ nombre: "T", hijos: procesarExpresion(expr) }] }
                ]
            });
        } else {
            programa.hijos.push({
                nombre: "Error",
                hijos: [{ nombre: `Sintaxis inválida: ${linea}` }]
            });
        }
    }

    return programa;
}

function procesarExpresion(expr) {
    const operadores = ["+", "-", "*", "/"];
    return expr
        .split(/\s+/)
        .map(tok =>
            operadores.includes(tok)
                ? { nombre: tok }
                : { nombre: `id (${tok})` }
        );
}

// === De AST a DOT ===
function astToDot(ast) {
    let dot = 'digraph G {\n  node [shape=box,fontname="Arial"];\n';
    let id = 0;
    function walk(node, parentId = null) {
        const myId = id++;
        dot += `  node${myId} [label="${node.nombre.replace(/"/g, '\\"')}"];\n`;
        if (parentId !== null) {
            dot += `  node${parentId} -> node${myId};\n`;
        }
        (node.hijos || []).forEach(child => walk(child, myId));
    }
    walk(ast);
    dot += "}";
    return dot;
}

// === Generar y descargar SVG ===
async function generarImagenArbol() {
    try {
        const codigo = document.getElementById("code").value;
        const ast = parsearCodigo(codigo);
        const dot = astToDot(ast);

        const viz = new Viz();
        const svgString = await viz.renderString(dot);

        // Convert SVG to Image
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('ast-canvas');
            canvas.width = img?.width || 800;
            canvas.height = img?.height || 600;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // ✅ Guardar como base64 PNG
            astImageBase64 = canvas.toDataURL('image/png');
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
    } catch (e) {
        console.error("Error generando el árbol:", e);
        alert("Hubo un error al generar la imagen del árbol.");
    }
}

function mostrarModalArbol() {
    const modal = document.getElementById('modal-arbol');
    const img = document.getElementById('imagen-arbol');
    img.src = astImageBase64;
    modal.classList.remove('hidden');
}

function cerrarModalArbol() {
    document.getElementById('modal-arbol').classList.add('hidden');
}

// === Asociar el botón ===
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("download-arbol");
    if (btn) btn.addEventListener("click", generarImagenArbol);
});
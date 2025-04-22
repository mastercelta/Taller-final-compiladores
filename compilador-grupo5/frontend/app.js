
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

    fetch('http://localhost:3000/ejecutar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
        .then(res => res.json())
        .then(data => {
            const output = document.getElementById('output');
            if (data.success) {
                output.innerHTML = data.output.replace(/\\n/g, '<br>');
            } else {
                output.textContent = '❌ ' + data.error;
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
// === Tu parser ===
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
      const ast    = parsearCodigo(codigo);
      const dot    = astToDot(ast);
  
      if (typeof Viz === "undefined") {
        throw new Error("Viz no se cargó. Revisa el orden de los <script>.");
      }
  
      const viz = new Viz();
      // Usamos renderString para obtener SVG como texto
      const svgString = await viz.renderString(dot);
  
      const uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
      const a   = document.createElement("a");
      a.href    = uri;
      a.download= "arbol_sintactico.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log("Descarga iniciada ✔️");
  
    } catch (e) {
      console.error("Error generando la imagen del árbol:", e);
      alert("Hubo un error al generar la imagen. Revisa la consola.");
    }
  }
  
  // === Otros métodos que ya tenías ===
  // ejecutarCodigo(), limpiarCodigo(), mostrarInstrucciones(), etc.
  
  // === Asociar el botón ===
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("download-arbol");
    if (btn) btn.addEventListener("click", generarImagenArbol);
  });
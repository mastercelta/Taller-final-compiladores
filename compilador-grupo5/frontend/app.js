
function ejecutarCodigo() {
    const code = document.getElementById('code').value;

    if (code.trim() === '') {
    document.getElementById('output').textContent = 'No hay código para ejecutar.';
    } else {
    document.getElementById('output').textContent = 'Ejecutando código...\n' + code;
    }
}

function limpiarCodigo(){
    document.getElementById("code").value="";
    document.getElementById("output").innerHTML="Consola de salida...";
}
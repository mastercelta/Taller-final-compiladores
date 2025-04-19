const compile = require('../compiler');

const code = `
def a igual 10;
def b igual 2;
def resultado igual a * b + 5;
mostrar resultado;
`;

const result = compile(code);

if (!result.success) {
    console.error("❌ Error:", result.error);
} else {
    console.log("✅ Compilación y ejecución exitosa.");
}
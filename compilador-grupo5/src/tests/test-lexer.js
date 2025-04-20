const lexer = require('../lexer');

const input = `
// Declarar variable
def a igual 5;
def b igual 3;

// Mostrar resultado
mostrar a;
mostrar b;
`;

try {
    const tokens = lexer(input);
    console.log(tokens);
} catch (err) {
    console.error("Error de análisis léxico:", err.message);
}
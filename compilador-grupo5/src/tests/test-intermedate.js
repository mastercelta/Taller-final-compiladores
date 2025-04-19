
const lexer = require('../lexer');
const parser = require('../parser');
const analyze = require('../semantic');
const generate = require('../intermediate');

const input = `
// Declarar variables
def a igual 4;
def b igual 3;
def resultado igual a + b * 2;

// Mostrar
mostrar resultado;
`;

try {
    const tokens = lexer(input);
    const ast = parser(tokens);
    analyze(ast);

    const quads = generate(ast);

    console.log("📦 Código Intermedio (Cuádruplas):\\n");
    quads.forEach((q, i) => {
        console.log(
            `${i + 1}: (${q.op}, ${q.arg1 || ''}, ${q.arg2 || ''}, ${q.result || ''})`
        );
    });

} catch (err) {
    console.error("❌ Error:", err.message);
}
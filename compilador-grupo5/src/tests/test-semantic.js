
const lexer = require('../lexer');
const parser = require('../parser');
const analyze = require('../semantic');

const input = `
// Declarar variables
def a igual 5;
def b igual 3;
def resultado  igual a + b * 2;

// Mostrar resultado
mostrar resultado;
`;

try {
    const tokens = lexer(input);
    console.log("🧩 Tokens generados:");
    console.log(tokens);

    const ast = parser(tokens);
    console.log("\\n🌳 Árbol de sintaxis (AST visual):");
    ast.forEach((node, index) => {
        printAST(node);
        if (index < ast.length - 1) console.log('');
    });

    analyze(ast);
    console.log("\\n✅ Análisis semántico exitoso (sin errores)");

} catch (error) {
    console.error("\\n❌ Error:", error.message);
}

// Función para imprimir el AST de forma visual
function printAST(node, indent = '', isLast = true) {
    const prefix = indent + (isLast ? '└── ' : '├── ');

    if (!node || typeof node !== 'object') {
        console.log(prefix + node);
        return;
    }

    let label = node.type;
    if (node.type === 'NUMBER' || node.type === 'IDENTIFIER') {
        label += `: ${node.value}`;
    }

    console.log(prefix + label);

    const newIndent = indent + (isLast ? '    ' : '│   ');

    const children = [];

    if (node.type === 'Declaration') {
        children.push({ label: 'identifier', node: { type: 'IDENTIFIER', value: node.identifier } });
        children.push({ label: 'expression', node: node.expression });
    } else if (node.type === 'Print') {
        children.push({ label: 'expression', node: node.expression });
    } else if (node.type === 'BinaryExpression') {
        children.push({ label: 'left', node: node.left });
        children.push({ label: 'right', node: node.right });
    }

    children.forEach((child, index) => {
        const isLastChild = index === children.length - 1;
        console.log(newIndent + (isLastChild ? '└── ' : '├── ') + child.label);
        printAST(child.node, newIndent + (isLastChild ? '    ' : '│   '), true);
    });
}
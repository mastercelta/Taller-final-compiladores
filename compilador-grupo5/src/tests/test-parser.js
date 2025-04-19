const lexer = require('../lexer');
const parser = require('../parser');

const input = `
// Declarar variables
def a igual 5;
def b igual 3;
def resultado igual s + b * 2;

// Mostrar resultado
mostrar resultado;
`;
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
        children.push({ label: 'identifier', node: node.identifier });
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

try {
    const tokens = lexer(input);
    console.log("🧩 Tokens generados:");
    console.log(tokens);

    const ast = parser(tokens);
    console.log("\n🌳 Árbol sintactico:");
    console.dir(ast, { depth: null });

    ast.forEach((node, index) => {
        printAST(node, '', index === ast.length - 1);
    });
} catch (error) {
    console.error("❌ Error:", error.message);
}


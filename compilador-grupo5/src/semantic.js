// Analizador semántico

function analyze(ast) {
    const symbolTable = new Map();

    for (const node of ast) {
        if (node.type === 'Declaration') {
            // No permitir redefinir la misma variable
            if (symbolTable.has(node.identifier)) {
                throw new Error(`Error semántico: la variable '${node.identifier}' ya fue declarada.`);
            }

            // Analizar que la expresión solo use variables existentes
            checkExpression(node.expression, symbolTable);

            // Agregar variable a la tabla de símbolos
            symbolTable.set(node.identifier, true);
        }

        if (node.type === 'Print') {
            checkExpression(node.expression, symbolTable);
        }
    }
}

function checkExpression(expr, symbolTable) {
    if (expr.type === 'IDENTIFIER') {
        if (!symbolTable.has(expr.value)) {
            throw new Error(`Error semántico: la variable '${expr.value}' no ha sido declarada.`);
        }
    }

    if (expr.type === 'BinaryExpression') {
        checkExpression(expr.left, symbolTable);
        checkExpression(expr.right, symbolTable);
    }
}

if (typeof module !== 'undefined') {
    module.exports = analyze;
}
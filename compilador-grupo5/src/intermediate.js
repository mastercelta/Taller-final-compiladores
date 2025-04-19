
let tempCounter = 0;

function generate(ast) {
    const quads = [];

    for (const node of ast) {
        if (node.type === 'Declaration') {
            const result = generateExpression(node.expression, quads);
            quads.push({ op: '=', arg1: result, arg2: null, result: node.identifier });
        }

        if (node.type === 'Print') {
            const result = generateExpression(node.expression, quads);
            quads.push({ op: 'print', arg1: result, arg2: null, result: null });
        }
    }

    return quads;
}

function generateExpression(expr, quads) {
    if (expr.type === 'NUMBER' || expr.type === 'IDENTIFIER') {
        return expr.value;
    }

    if (expr.type === 'BinaryExpression') {
        const left = generateExpression(expr.left, quads);
        const right = generateExpression(expr.right, quads);
        const temp = newTemp();
        quads.push({ op: expr.operator, arg1: left, arg2: right, result: temp });
        return temp;
    }

    throw new Error("Expresión no soportada en generación intermedia.");
}

function newTemp() {
    return `t${++tempCounter}`;
}

if (typeof module !== 'undefined') {
    module.exports = generate;
}

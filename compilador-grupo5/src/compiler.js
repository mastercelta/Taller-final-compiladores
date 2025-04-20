// Módulo principal del compilador

const lexer = require('./lexer');
const parser = require('./parser');
const analyze = require('./semantic');
const generate = require('./intermediate');

function execute(ast, symbolTable = {}) {
    for (const node of ast) {
        if (node.type === 'Declaration') {
            symbolTable[node.identifier] = evaluate(node.expression, symbolTable);
        }

        if (node.type === 'Print') {
            const result = evaluate(node.expression, symbolTable);
            console.log(result);
        }
    }
}

function evaluate(expr, context) {
    if (expr.type === 'NUMBER') {
        return Number(expr.value);
    }

    if (expr.type === 'IDENTIFIER') {
        if (context[expr.value] === undefined) {
            throw new Error(`Variable '${expr.value}' no declarada.`);
        }
        return context[expr.value];
    }

    if (expr.type === 'BinaryExpression') {
        const left = evaluate(expr.left, context);
        const right = evaluate(expr.right, context);

        switch (expr.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return right !== 0 ? left / right : (() => { throw new Error("División por cero"); })();
        }
    }

    throw new Error("Expresión no válida");
}

function compile(input) {
    try {
        const tokens = lexer(input);
        const ast = parser(tokens);
        analyze(ast);
        const intermediate = generate(ast);
        execute(ast);

        return { success: true, tokens, ast, intermediate };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

if (typeof module !== 'undefined') {
    module.exports = compile;
}
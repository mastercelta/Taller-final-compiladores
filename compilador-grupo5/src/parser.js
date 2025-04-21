// Analizador sintáctico
// parser.js - Analizador sintáctico para el mini lenguaje
function parser(tokens) {
    let current = 0;

    function peek() {
        return tokens[current];
    }

    function consume(expectedType) {
        const token = tokens[current];
        console.log(token);
        console.log(current);
        if (!token || token.type !== expectedType) {
            if (!token) {
                const tokenLast = tokens[current - 1];
                throw new Error(`Error sintáctico1: se esperaba '${expectedType}' en línea ${tokenLast.line}, columna ${tokenLast.col}`);
            }
            //Revisar si es el ultimo token de la linea y el expectedType es diferente
            if (token.line !== tokens[current - 1].line && token.type !== expectedType) {
                const tokenLast = tokens[current - 1];
                throw new Error(`Error sintáctico2: se esperaba '${expectedType}' en línea ${tokenLast.line}, columna ${tokenLast.col}`);
            }
            throw new Error(
                `Error sintáctico: se esperaba '${expectedType}' en línea ${token.line}, columna ${token?.col}`
            );
        }
        current++;
        return token;
    }

    function parsePrimary() {
        const token = peek();
        if (token.type === 'NUMBER' || token.type === 'IDENTIFIER') {
            return { type: token.type, value: consume(token.type).value };
        }

        if (token.type === 'LPAREN') {
            consume('LPAREN');
            const expr = parseExpression();
            consume('RPAREN');
            return expr;
        }
        
        if (token.line !== tokens[current - 1].line) {
            const tokenLast = tokens[current - 1];
            throw new Error(`Expresión no válida en línea ${tokenLast.line}, columna ${tokenLast.col}`);
        }

        throw new Error(`Expresión no válida en línea ${token.line}, columna ${token.col}`);
    }

    function parseTerm() {
        let node = parsePrimary();

        while (peek() && peek().type === 'OPERATOR' && (peek().value === '*' || peek().value === '/')) {
            const operator = consume('OPERATOR').value;
            const right = parsePrimary();
            node = { type: 'BinaryExpression', operator, left: node, right };
        }

        return node;
    }

    function parseExpression() {
        let node = parseTerm();

        while (peek() && peek().type === 'OPERATOR' && (peek().value === '+' || peek().value === '-')) {
            const operator = consume('OPERATOR').value;
            const right = parseTerm();
            node = { type: 'BinaryExpression', operator, left: node, right };
        }

        return node;
    }

    function parseStatement() {
        const token = peek();
        if (!token) return null;

        if (token.type === 'DEF') {
            consume('DEF');
            const id = consume('IDENTIFIER');
            consume('IGUAL');
            const expr = parseExpression();
            consume('SEMICOLON');
            return { type: 'Declaration', identifier: id.value, expression: expr };
        }

        if (token.type === 'MOSTRAR') {
            consume('MOSTRAR');
            const expr = parseExpression();
            consume('SEMICOLON');
            return { type: 'Print', expression: expr };
        }

        throw new Error(`Instrucción no válida en línea ${token.line}, columna ${token.col}`);
    }

    function parseProgram() {
        const ast = [];
        while (current < tokens.length) {
            const stmt = parseStatement();
            if (stmt) ast.push(stmt);
        }
        return ast;
    }

    return parseProgram();
}


if (typeof module !== 'undefined') {
    module.exports = parser;
}


// Analizador léxico
// lexer.js - Analizador léxico del mini lenguaje
function lexer(input) {
    const tokens = [];
    const lines = input.split(/\r?\n/);

    const tokenSpecs = [
        [/^\s+/, null],    // Espacios
        [/^\/\/.*$/, null], // Comentarios
        [/^def\b/, 'DEF'], 
        [/^igual\b/, 'IGUAL'], 
        [/^mostrar\b/, 'MOSTRAR'], 
        [/^[a-zA-Z_][a-zA-Z0-9_]*/, 'IDENTIFIER'], 
        [/^[0-9]+(?:\.[0-9]+)?/, 'NUMBER'], 
        [/^[+\-*/]/, 'OPERATOR'],
        [/^;/, 'SEMICOLON'],
        [/^\(/, 'LPAREN'],
        [/^\)/, 'RPAREN']
    ];

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        let line = lines[lineNum];
        let col = 0;

        while (line.length > 0) {
            let matched = false;

            for (const [regex, type] of tokenSpecs) {
                const match = regex.exec(line);
                if (match) {
                    matched = true;
                    const value = match[0];
                    if (type) {
                        tokens.push({ type, value, line: lineNum + 1, col });
                    }
                    col += value.length;
                    line = line.slice(value.length);
                    break;
                }
            }

            if (!matched) {
                throw new Error(
                    `Token no reconocido en línea ${lineNum + 1}, columna ${col + 1}: "${line}"`
                );
            }
        }
    }

    return tokens;
}

// Exportar para usar en el compilador
if (typeof module !== 'undefined') {
    module.exports = lexer;
}

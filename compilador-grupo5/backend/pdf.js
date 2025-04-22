const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const compile = require('../src/compiler');

router.post('/', (req, res) => {
    const { code, astImageBase64 } = req.body;

    let output = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => output.push(args.join(' '));

    const result = compile(code);
    console.log = originalConsoleLog;

    if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
    }

    const { tokens, ast, intermediate } = result;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=informe_compilador.pdf');

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('Informe del Compilador – Grupo 5', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(
        'Este informe presenta las fases del compilador: análisis léxico, sintáctico, semántico y la generación de código intermedio a partir del código fuente proporcionado.',
        { align: 'left' }
    );
    doc.moveDown().moveDown();

    // Fase 1: Lexer
    doc.fontSize(14).text('1. Análisis Léxico (Tokens Generados):', { underline: true });
    doc.moveDown(0.5);
    tokens.forEach(t => {
        doc.fontSize(10).text(`- Tipo: ${t.type}, Valor: ${t.value}`);
    });
    doc.moveDown();

    // Fase 2: Parser (AST)
    doc.fontSize(14).text('2. Análisis Sintáctico (Árbol de Sintaxis):', { underline: true });
    doc.moveDown(0.5);
    if (astImageBase64) {
        const imgBuffer = Buffer.from(astImageBase64.split(',')[1], 'base64');
        doc.image(imgBuffer, { fit: [450, 300], align: 'center' });
    } else {
        doc.fontSize(10).text('No se proporcionó imagen del AST.');
    }
    doc.moveDown();

    // Fase 3: Semántico
    doc.fontSize(14).text('3. Análisis Semántico:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text('✓ Análisis semántico completado exitosamente.');
    doc.moveDown();

    // Fase 4: Código Intermedio
    doc.fontSize(14).text('4. Generación de Código Intermedio (Cuádruplas):', { underline: true });
    doc.moveDown(0.5);
    intermediate.forEach((q, i) => {
        doc.fontSize(10).text(`${i + 1}: (${q.op}, ${q.arg1 || ''}, ${q.arg2 || ''}, ${q.result || ''})`);
    });

    // Salida final
    doc.moveDown();
    doc.fontSize(14).text('5. Salida del programa (mostrar):', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(output.join('\n'));

    doc.end();
});

module.exports = router;

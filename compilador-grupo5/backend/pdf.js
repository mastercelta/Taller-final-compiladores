const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.post('/', (req, res) => {
    const { tokens, ast, intermediate } = req.body;

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=informe.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Informe del Compilador – Grupo 5', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text('Tokens:');
    tokens.forEach(t => doc.text(`- ${t.type}: ${t.value}`));
    doc.moveDown();

    doc.text('Código Intermedio:');
    intermediate.forEach(q => doc.text(`(${q.op}, ${q.arg1}, ${q.arg2}, ${q.result})`));

    doc.end();
});

module.exports = router;
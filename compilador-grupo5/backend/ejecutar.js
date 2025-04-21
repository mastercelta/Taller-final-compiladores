const express = require('express');
const router = express.Router();
const compile = require('../src/compiler');

router.post('/', (req, res) => {
    const { code } = req.body;
    let salida = [];
    const originalConsoleLog = console.log;

    try {
        console.log = (...args) => {
            salida.push(args.join(' '));
        };

        const resultado = compile(code);

        console.log = originalConsoleLog;

        if (!resultado.success) {
            return res.status(200).json({
                success: false,
                error: resultado.error,
            });
        }

        res.status(200).json({
            success: true,
            tokens: resultado.tokens,
            ast: resultado.ast,
            intermedio: resultado.intermediate,
            output: salida.join('\\n'),
        });

    } catch (err) {
        console.log = originalConsoleLog;
        res.status(500).json({ success: false, error: 'Error interno al compilar.' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const lexer = require('../src/lexer');
const parser = require('../src/parser');

router.post('/', (req, res) => {
    if (!req.body || !req.body.code) {
        return res.status(400).json({ success: false, message: 'Código no proporcionado.' });
    }
    const { code } = req.body;
    try {
        const tokens = lexer(code);
        const ast = parser(tokens);

        res.json({ success: true, message: 'Código válido.' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

module.exports = router;
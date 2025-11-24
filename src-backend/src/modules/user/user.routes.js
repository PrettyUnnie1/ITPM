const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Module is ready!" });
});

module.exports = router;
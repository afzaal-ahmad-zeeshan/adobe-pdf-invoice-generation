const express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
    res.status(200).render("home", { page: 'home' });
});

module.exports = router;

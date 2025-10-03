const express = require("express");
const router = express.Router();

//index-route-post
router.get("/", (req, res)=>{
    res.send("hi i am post");
});

//show-route-post
router.get("/:id", (req, res)=>{
    res.send("hi i am post");
});

//edit-route-post
router.get("/new", (req, res)=>{
    res.send("hii i am post");
});

//update-route-post
router.get("/:id/new", (req, res)=>{
    res.send("hii i post");
});

module.exports = router;
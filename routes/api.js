var express = require('express');
var router = express.Router();
//==Middleware====================================================================|
var API_C = {
    OK: 200,
    STARTED: 201,
    ENDED: 205,
    GOT_DATA: 202,
    NAH_BRO: 403,
    NOT_FOUND: 404
}
var APIErr = function(res,error,code) {return res.status(code||API_C.NAH_BRO).json({message: error})}
var pluginBodyConverter = function(req,res,next){
    if (!req.body || !req.body.data) {return APIErr(res,"No Data Provided");return}
    try {req.pluginBody=JSON.parse(req.body.data);next()} catch(err) {return APIErr(res,Object.keys(err).length?err:"Could not Parse your JSON")}
}
//==Routes=INTERNAL-API===========================================================|
router.get('/removeTest/:id', function(req, res) {
    Test.findById(req.params.id, function(err,u){
        var active = u.state=="running"
        u.remove(function(err){
            if (err) {return APIErr(res, err)}
            if (active) {GLOBAL.io.sockets.emit("Tests:Update:Active", {update: -1})}
            GLOBAL.io.sockets.emit("Tests:Update:All", {update: -1})
            GLOBAL.io.sockets.emit("Tests:Remove", {id: u._id})
            res.json({message: "Success"})
        })
    })
})
//==Routes=JMETER=================================================================|
router.post('/start', pluginBodyConverter, function(req, res) {
})
router.use(function(req,res){res.status(API_C.NOT_FOUND).json({message: "No Such API Endpoint", url: req.originalUrl})})
module.exports = router;

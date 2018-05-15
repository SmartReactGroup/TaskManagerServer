"use strict";var _express=require("express"),_express2=_interopRequireDefault(_express),_mongoose=require("mongoose"),_mongoose2=_interopRequireDefault(_mongoose),_environment=require("./config/environment"),_environment2=_interopRequireDefault(_environment),_http=require("http"),_http2=_interopRequireDefault(_http),_websockets=require("./config/websockets"),_websockets2=_interopRequireDefault(_websockets),_express3=require("./config/express"),_express4=_interopRequireDefault(_express3),_routes=require("./routes"),_routes2=_interopRequireDefault(_routes),_seed=require("./config/seed"),_seed2=_interopRequireDefault(_seed);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}_mongoose2.default.Promise=require("bluebird"),_mongoose2.default.connect(_environment2.default.mongo.uri,_environment2.default.mongo.options),_mongoose2.default.connection.on("error",function(e){console.error("MongoDB connection error: "+e),process.exit(-1)});var app=(0,_express2.default)(),server=_http2.default.createServer(app),wsInitPromise=(0,_websockets2.default)(server);function startServer(){app.angularFullstack=server.listen(_environment2.default.port,_environment2.default.ip,function(){console.log("Express server listening on %d, in %s mode",_environment2.default.port,app.get("env"))})}(0,_express4.default)(app),(0,_routes2.default)(app),wsInitPromise.then(function(e){app.primus=e}).then(_seed2.default).then(startServer).catch(function(e){console.log("Server failed to start due to error: %s",e)}),exports=module.exports=app;
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _mongoose=require("mongoose"),_mongoose2=_interopRequireDefault(_mongoose),_thing=require("./thing.events");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var ThingSchema=new _mongoose2.default.Schema({name:String,info:String,active:Boolean});(0,_thing.registerEvents)(ThingSchema),exports.default=_mongoose2.default.model("Thing",ThingSchema);
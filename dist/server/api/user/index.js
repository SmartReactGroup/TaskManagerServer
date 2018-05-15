"use strict";var _express=require("express"),_user=require("./user.controller"),controller=_interopRequireWildcard(_user),_auth=require("../../auth/auth.service"),auth=_interopRequireWildcard(_auth);function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(r[t]=e[t]);return r.default=e,r}var router=(0,_express.Router)();router.get("/",auth.hasRole("admin"),controller.index),router.delete("/:id",auth.hasRole("admin"),controller.destroy),router.get("/me",auth.isAuthenticated(),controller.me),router.put("/:id/password",auth.isAuthenticated(),controller.changePassword),router.put("/:id",auth.isAuthenticated(),controller.upsert),router.get("/:id",auth.isAuthenticated(),controller.show),router.post("/",controller.create),module.exports=router;
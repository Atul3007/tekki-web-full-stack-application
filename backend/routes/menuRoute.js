const express = require('express');
const { addMenu, getParentMenu, getChildrenMenu, editMenu, deleteMenu} = require('../controllers/menuController');

const menuRouter = express.Router();

menuRouter.post("/addMenu",addMenu);
menuRouter.get("/getMenu",getParentMenu);
menuRouter.get("/childMenu/:id",getChildrenMenu);
menuRouter.put("/editMenu/:id",editMenu);
menuRouter.delete("/deleteMenu/:id",deleteMenu)

module.exports=menuRouter;
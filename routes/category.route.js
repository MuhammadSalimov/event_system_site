const { Router } = require("express");
const categoryController = require("../controllers/category.controller");
const router = Router();
router.get("/get", categoryController.getAll);
router.post("/create", categoryController.create);
module.exports = router;

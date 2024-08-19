const { Router } = require("express");
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();
router.get("/get", bookingController.getAll);
router.post("/create", [authMiddleware], bookingController.create);
router.delete("/delete/:id", bookingController.delete);
router.get("/get/:id", bookingController.getOne);
router.get("/getById",[authMiddleware], bookingController.getByAuthorId);
module.exports = router;

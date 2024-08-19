const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authorMiddleware = require("../middlewares/author.middleware");
const eventController = require("../controllers/event.controller");
const { body } = require("express-validator");
const router = express.Router();

router.get("/get", eventController.getAll);
router.post(
  "/create",
  [authMiddleware],
  body("title").isString(),
  body("description").isString(),
  body("price").isString(),
  body("location").isString(),
  body("startTime").isString(),
  body("maxAttendees").isString(),
  body("categoryId").isString(),
  body("format").isString(),
  body("startDate").isString(),
  eventController.create
);
router.get("/getId/:id"  ,  eventController.getByAuthorId)

router.delete(
  "/delete/:id",
  authMiddleware,
  eventController.delete
);
router.put("/edit/:id", authMiddleware, authorMiddleware, eventController.edit);
router.get("/get-one/:id" ,  eventController.getOne);
router.get("/get/data", eventController.getData)

module.exports = router;

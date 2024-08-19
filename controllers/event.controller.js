const { validationResult } = require("express-validator");
const eventService = require("../service/event.service");
const BaseError = require("../errors/base.error");
const prisma = require("../utils/connection");

class EventController {
  async getAll(req, res, next) {
    try {
      const allEvents = await eventService.getAll();
      res.status(200).json(allEvents);
    } catch (error) {
      next(error);
    }
  } // true

  async create(req, res, next) {

    // const addCategory=async ()=>{
    //   const category = await prisma.category.create({
    //     data:{
    //       categoryName:"development"
    //     }
    //   })
    //   console.log(category);
    // }
    // addCategory()


    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          BaseError.BadRequest("Error with validation", errors.array())
        );
      }
      const event = await eventService.create(
        req.body,
        req.files.picture,
        req.user.id
      );
      res.status(201).json(event);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const post = await eventService.delete(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      const { body, params, files } = req;
      const post = await eventService.edit(body, params.id, files?.picture);
      res.status(200).json(post);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const post = await eventService.getOne(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async getByAuthorId(req, res, next) {
    try {
      const post = await eventService.getByAuthorId(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async getData(req, res, next) {
    try {
      const data = await eventService.getData();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();

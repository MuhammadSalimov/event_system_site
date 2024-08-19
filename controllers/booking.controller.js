const { validationResult } = require("express-validator");
const BaseError = require("../errors/base.error");
const bookingService = require("../service/booking.service");

class BookingController {
  async getAll(req, res, next) {
    try {
      const allBooking = await bookingService.getAll();
      res.status(200).json(allBooking);
    } catch (error) {
      next(error);
    }
  } // true

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          BaseError.BadRequest("Error with validation", errors.array())
        );
      }
      const booking = await bookingService.create({
        eventId: req.body.eventId,
        userId: req.user.id,
      });
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleted = await bookingService.delete(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const data = await bookingService.getOne(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getByAuthorId(req, res, next) {
    try {
      const post = await bookingService.getByAuthorId(req.user.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();

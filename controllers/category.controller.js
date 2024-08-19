const BaseError = require("../errors/base.error");
const prisma = require("../utils/connection");

class categoryController {
  async getAll(req, res, next) {
    try {
      const allCateg = await prisma.category.findMany();
      return res.status(200).json(allCateg);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      req.body.categoryName = req.body.categoryName.toLowerCase();
      const find = await prisma.category.findFirst({
        where: req.body,
      });
      if (find) throw BaseError.BadRequest("Category Already added");
      const newCateg = await prisma.category.create({
        data: req.body,
      });
      return res.status(200).json(newCateg);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new categoryController();

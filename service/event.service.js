const BaseError = require("../errors/base.error");

const prisma = require("../utils/connection");
const fileService = require("./file.service");

class EventService {
  async create(post, picture, author) {
    const fileName = fileService.save(picture);
    post.price = +post.price;
    post.maxAttendees = +post.maxAttendees;
    const newEvent = await prisma.event.create({
      data: {
        ...post,
        photo: fileName,
        organizerId: author,
      },
    });
    return newEvent;
  }

  async getAll() {
    const allEvents = await prisma.event.findMany({
      include: {
        organizer: {
          select: { fullName: true },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });
    return allEvents;
  }

  // async getAll() {
  // 	const allUsers = await prisma.user.findMany()
  // 	return allUsers
  // }

  async delete(id) {
    const post = await prisma.event.findUnique({ where: { id } });
    await fileService.delete(post.photo);
    const event = await prisma.event.delete({
      where: { id },
    });
    return event;
  }

  async edit(post, id, files) {
    if (!id) {
      throw new Error("Id not found");
    }
    if (files) {
      const findPost = await prisma.event.findUnique({ where: { id } });

      await fileService.delete(findPost.photo);
      const fileName = fileService.save(files);
      post.photo = fileName;
    }
    post.price = +post.price;
    post.maxAttendees = +post.maxAttendees;
    const updatedData = await prisma.event.update({
      where: { id },
      data: post,
      include: {
        organizer: {
          select: { fullName: true },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });
    return updatedData;
  }

  async getOne(id) {
    const post = await prisma.event.findUnique({
      where: { id },
    });

    return post;
  }

  async getByAuthorId(authorId) {
    if (!authorId) throw BaseError.BadRequest("");
    const myPosts = await prisma.event.findMany({
      where: {
        organizerId: authorId,
      },
      include: {
        organizer: {
          select: { fullName: true },
        },
        category: {
          select: {
            categoryName: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });
    return myPosts;
  }

  async getData() {
    const userInfo = await prisma.user.findMany({
      select: {
        _count: {
          select: {
            Participant: true,
            events: true,
          },
        },
        fullName: true,
        isActivated: true,
        createdAt: true,
        email: true,
      },
    });
    const countUser = await prisma.user.count();
    const countEvent = await prisma.event.count();
    const countParts = await prisma.participant.count();
    const countCateg = await prisma.category.count();
    const data = {
      countUser,
      countEvent,
      countParts,
      countCateg,
      userInfo,
    };

    return data;
  }
}

module.exports = new EventService();

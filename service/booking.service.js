const BaseError = require("../errors/base.error");
const prisma = require("../utils/connection");

class BookingService {
  async getAll() {
    const allData = await prisma.participant.findMany({
      include: {
        event: {
          select: {
            location: true,
            maxAttendees: true,
            title: true,
            format: true,
            startDate: true,
            photo: true,
            price: true,
          },
        },
      },
    });
    return allData;
  }

  async create(data) {
    console.log("df wergfbxcfx werthbefdv");

    const findEvent = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: {
        organizer: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    }); //maxendends - participant.count
    if (!findEvent || findEvent.organizer.id == data.userId)
      throw BaseError.BadRequest(
        "It is not possible to reserve a place for an event you have organized yourself"
      );
    if (findEvent.maxAttendees > 0) {
      if (!(findEvent.maxAttendees > findEvent._count.participants))
        throw BaseError.BadRequest("Joylar soni qolmagan");
    }

    const Participant = await prisma.participant.findMany({
      where: {
        eventId: data.eventId,
        userId: data.userId,
      },
    });

    if (!Participant.length == 0)
      throw BaseError.BadRequest("You are already booked for this event");
    const created = await prisma.participant.create({
      data,
    });
    return created;
  }

  async delete(id) {
    const deleted = await prisma.participant.delete({
      where: { id },
    });
    return deleted;
  }

  async getOne(id) {
    const participant = await prisma.participant.findUnique({
      where: { id },
    });
    return participant;
  }

  async getByAuthorId(authorId) {
    const participants = await prisma.participant.findMany({
      where: {
        userId: authorId,
      },
      include: {
        event: {
          select: {
            location: true,
            maxAttendees: true,
            title: true,
            format: true,
            startDate: true,
            photo: true,
            price: true,
            startTime: true,
            organizer:{
              select:{
                fullName:true
              }
            }
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });
    return participants;
  }
}

module.exports = new BookingService();

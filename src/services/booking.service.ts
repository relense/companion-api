import { prisma } from "../prisma.js";
import { Errors } from "../utils/errors.js";
import { SecurityContext } from "./security.service.js";

async function createAdminBooking(params: {
  context: SecurityContext<"ADMIN">;
  clientId: string;
  parkingSpotId: string;
  startDateTime: Date;
  endDateTime: Date;
}) {
  const currentTime = new Date();
  const startDate = new Date(params.startDateTime);
  const endDate = new Date(params.endDateTime);

  if (
    startDate.getTime() <= currentTime.getTime() ||
    endDate.getTime() <= currentTime.getTime() ||
    startDate.getTime() >= endDate.getTime()
  ) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  // Confirm if the parking spot exists.
  const parkingSpot = await prisma.parkingSpot.findFirst({
    where: {
      id: params.parkingSpotId,
    },
  });

  if (!parkingSpot) {
    throw Errors.parkingSpotNotFound(params.parkingSpotId);
  }

  // Find there is an active booking in our desired time slot.
  const activeBookings = await prisma.booking.findFirst({
    where: {
      parkingSpot: {
        id: params.parkingSpotId,
      },
      softDeleteDateTime: null,
      AND: [
        {
          startDateTime: {
            lt: params.endDateTime,
          },
        },
        {
          endDateTime: {
            gt: params.startDateTime,
          },
        },
      ],
    },
  });

  if (activeBookings) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  const createdBooking = await prisma.booking.create({
    data: {
      user: {
        connect: { id: params.clientId },
      },
      startDateTime: params.startDateTime,
      endDateTime: params.endDateTime,
      parkingSpot: { connect: { id: params.parkingSpotId } },
    },
  });

  return createdBooking;
}

async function getAdminBooking(params: {
  context: SecurityContext<"ADMIN">;
  bookingId: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
    },
    include: {
      parkingSpot: true,
    },
  });

  if (!booking) {
    throw Errors.bookingNotFound(params.bookingId);
  }

  return booking;
}

async function getAllAdminBookings(params: {
  context: SecurityContext<"ADMIN">;
}) {
  const bookings = await prisma.booking.findMany({
    include: {
      parkingSpot: true,
    },
  });

  if (bookings.length === 0) {
    throw Errors.bookingsNotFound();
  }

  return bookings;
}

async function updateAdminBooking(params: {
  context: SecurityContext<"ADMIN">;
  bookingId: string;
  parkingSpotId: string;
  startDateTime: Date;
  endDateTime: Date;
}) {
  const currentTime = new Date();
  const startDate = new Date(params.startDateTime);
  const endDate = new Date(params.endDateTime);

  if (
    startDate.getTime() <= currentTime.getTime() ||
    endDate.getTime() <= currentTime.getTime() ||
    startDate.getTime() >= endDate.getTime()
  ) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  // Find the active booking we want
  const activeBooking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
      softDeleteDateTime: null,
    },
  });

  if (!activeBooking) {
    throw Errors.bookingNotFound(params.bookingId);
  }

  // Find if there are any bookings for the time slot and parking spot we want to change to
  const bookedSlots = await prisma.booking.findFirst({
    where: {
      parkingSpotId: params.parkingSpotId,
      softDeleteDateTime: null,
      AND: [
        {
          startDateTime: {
            lt: params.endDateTime,
          },
        },
        {
          endDateTime: {
            gt: params.startDateTime,
          },
        },
      ],
    },
  });

  if (bookedSlots && bookedSlots.id !== params.bookingId) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  return await prisma.booking.update({
    where: {
      id: params.bookingId,
    },
    data: {
      startDateTime: params.startDateTime,
      endDateTime: params.endDateTime,
      parkingSpot: {
        connect: {
          id: params.parkingSpotId,
        },
      },
    },
    include: {
      parkingSpot: true,
    },
  });
}

async function deleteAdminBooking(params: {
  context: SecurityContext<"ADMIN">;
  bookingId: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
      softDeleteDateTime: null,
    },
    include: {
      parkingSpot: true,
    },
  });

  if (!booking) {
    throw Errors.bookingNotFound(params.bookingId);
  }

  await prisma.booking.update({
    where: {
      id: params.bookingId,
    },
    data: {
      softDeleteDateTime: new Date(),
    },
  });

  return booking;
}

async function createClientBooking(params: {
  context: SecurityContext<"CLIENT">;
  parkingSpotId: string;
  startDateTime: Date;
  endDateTime: Date;
}) {
  const currentTime = new Date();
  const startDate = new Date(params.startDateTime);
  const endDate = new Date(params.endDateTime);

  if (
    startDate.getTime() <= currentTime.getTime() ||
    endDate.getTime() <= currentTime.getTime() ||
    startDate.getTime() >= endDate.getTime()
  ) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  // Confirm if the parking spot exists.
  const parkingSpot = await prisma.parkingSpot.findFirst({
    where: {
      id: params.parkingSpotId,
    },
  });

  if (!parkingSpot) {
    throw Errors.parkingSpotNotFound(params.parkingSpotId);
  }

  // Find there is an active booking in our desired time slot.
  const activeBookings = await prisma.booking.findFirst({
    where: {
      parkingSpot: {
        id: params.parkingSpotId,
      },
      softDeleteDateTime: null,
      AND: [
        {
          startDateTime: {
            lt: params.endDateTime,
          },
        },
        {
          endDateTime: {
            gt: params.startDateTime,
          },
        },
      ],
    },
  });

  if (activeBookings) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  const createdBooking = await prisma.booking.create({
    data: {
      user: {
        connect: { id: params.context.userId },
      },
      startDateTime: params.startDateTime,
      endDateTime: params.endDateTime,
      parkingSpot: { connect: { id: params.parkingSpotId } },
    },
  });

  return createdBooking;
}

async function getClientBooking(params: {
  context: SecurityContext<"CLIENT">;
  bookingId: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
      userId: params.context.userId,
      softDeleteDateTime: null,
    },
    include: {
      parkingSpot: true,
    },
  });

  if (!booking) {
    throw Errors.bookingNotFound(params.bookingId);
  }

  return booking;
}

async function getAllClientBookings(params: {
  context: SecurityContext<"CLIENT">;
}) {
  const bookings = await prisma.booking.findMany({
    where: {
      userId: params.context.userId,
      softDeleteDateTime: null,
    },
    include: {
      parkingSpot: true,
    },
  });

  if (bookings.length === 0) {
    throw Errors.bookingsNotFound();
  }

  return bookings;
}

async function updateClientBooking(params: {
  context: SecurityContext<"CLIENT">;
  bookingId: string;
  parkingSpotId: string;
  startDateTime: Date;
  endDateTime: Date;
}) {
  const currentTime = new Date();
  const startDate = new Date(params.startDateTime);
  const endDate = new Date(params.endDateTime);

  if (
    startDate.getTime() <= currentTime.getTime() ||
    endDate.getTime() <= currentTime.getTime() ||
    startDate.getTime() >= endDate.getTime()
  ) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
      userId: params.context.userId,
      softDeleteDateTime: null,
    },
    include: {
      parkingSpot: true,
    },
  });

  if (!booking) {
    throw Errors.bookingNotFound(params.bookingId);
  }

  // Find if there are any bookings for the time slot and parking spot we want to change to
  const bookedSlots = await prisma.booking.findFirst({
    where: {
      parkingSpotId: params.parkingSpotId,
      softDeleteDateTime: null,
      AND: [
        {
          startDateTime: {
            lt: params.endDateTime,
          },
        },
        {
          endDateTime: {
            gt: params.startDateTime,
          },
        },
      ],
    },
  });

  if (bookedSlots && bookedSlots.id !== params.bookingId) {
    throw Errors.invalidDates(params.startDateTime, params.endDateTime);
  }

  return await prisma.booking.update({
    where: {
      id: params.bookingId,
    },
    data: {
      startDateTime: params.startDateTime,
      endDateTime: params.endDateTime,
      parkingSpot: {
        connect: {
          id: params.parkingSpotId,
        },
      },
    },
    include: {
      parkingSpot: true,
    },
  });
}

async function deleteClientBooking(params: {
  context: SecurityContext<"CLIENT">;
  bookingId: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
      userId: params.context.userId,
      softDeleteDateTime: null,
    },
    include: {
      parkingSpot: true,
    },
  });

  if (!booking) {
    throw Errors.bookingNotFound(params.bookingId);
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: params.bookingId,
    },
    data: {
      softDeleteDateTime: new Date(),
    },
  });

  return updatedBooking;
}

const bookingService = {
  createAdminBooking,
  getAdminBooking,
  getAllAdminBookings,
  updateAdminBooking,
  deleteAdminBooking,
  createClientBooking,
  getClientBooking,
  getAllClientBookings,
  updateClientBooking,
  deleteClientBooking,
};

export { bookingService };

import { prisma } from "../prisma.js";
import { Errors } from "../utils/errors.js";
async function createAdminBooking(params) {
    const currentTime = new Date();
    const startDate = new Date(params.startDateTime);
    const endDate = new Date(params.endDateTime);
    if (startDate.getTime() <= currentTime.getTime() ||
        endDate.getTime() <= currentTime.getTime() ||
        startDate.getTime() >= endDate.getTime()) {
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
async function getAdminBooking(params) {
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
async function getAllAdminBookings(params) {
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
async function updateAdminBooking(params) {
    const currentTime = new Date();
    const startDate = new Date(params.startDateTime);
    const endDate = new Date(params.endDateTime);
    if (startDate.getTime() <= currentTime.getTime() ||
        endDate.getTime() <= currentTime.getTime() ||
        startDate.getTime() >= endDate.getTime()) {
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
async function deleteAdminBooking(params) {
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
async function createClientBooking(params) {
    const currentTime = new Date();
    const startDate = new Date(params.startDateTime);
    const endDate = new Date(params.endDateTime);
    if (startDate.getTime() <= currentTime.getTime() ||
        endDate.getTime() <= currentTime.getTime() ||
        startDate.getTime() >= endDate.getTime()) {
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
async function getClientBooking(params) {
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
async function getAllClientBookings(params) {
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
async function updateClientBooking(params) {
    const currentTime = new Date();
    const startDate = new Date(params.startDateTime);
    const endDate = new Date(params.endDateTime);
    if (startDate.getTime() <= currentTime.getTime() ||
        endDate.getTime() <= currentTime.getTime() ||
        startDate.getTime() >= endDate.getTime()) {
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
async function deleteClientBooking(params) {
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

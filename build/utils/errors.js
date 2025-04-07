import { AppError } from "../expressServer.js";
const Errors = {
    userNotFound: (token) => new AppError(`User with token ${token} not found`, 400),
    bookingNotFound: (bookindId) => new AppError(`Booking with id ${bookindId} not found`, 400),
    bookingsNotFound: () => new AppError(`Bookings not found`, 400),
    parkingSpotNotFound: (parkingSpotId) => new AppError(`Parking spot with id ${parkingSpotId} not found`, 400),
    invalidDates: (startDateTime, endDateTime) => new AppError(`The start date ${startDateTime} and end date ${endDateTime} are invalid`, 400),
    unauthorized: () => new AppError("Unauthorized", 401),
    forbidden: () => new AppError("Forbidden", 403),
};
export { Errors };

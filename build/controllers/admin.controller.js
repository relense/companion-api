import express from "express";
import { bookingService } from "../services/booking.service.js";
import { securityService } from "../services/security.service.js";
const router = express.Router();
router.post("/bookings", async (req, res, next) => {
    try {
        const response = await bookingService.createAdminBooking({
            context: securityService.assertAdminContext(req.context),
            clientId: req.body.clientId,
            parkingSpotId: req.body.parkingSpotId,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
        });
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
});
router.get("/bookings", async (req, res, next) => {
    try {
        const response = await bookingService.getAllAdminBookings({
            context: securityService.assertAdminContext(req.context),
        });
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
});
router.get("/bookings/:bookingId", async (req, res, next) => {
    try {
        const response = await bookingService.getAdminBooking({
            context: securityService.assertAdminContext(req.context),
            bookingId: req.params.bookingId,
        });
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
});
router.put("/bookings/:bookingId", async (req, res, next) => {
    try {
        const response = await bookingService.updateAdminBooking({
            context: securityService.assertAdminContext(req.context),
            bookingId: req.params.bookingId,
            parkingSpotId: req.body.parkingSpotId,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
        });
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/bookings/:bookingId", async (req, res, next) => {
    try {
        const response = await bookingService.deleteAdminBooking({
            context: securityService.assertAdminContext(req.context),
            bookingId: req.params.bookingId,
        });
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
});
export { router as adminRouter };

import express from "express";
import { bookingService } from "../services/booking.service.js";
import { securityService } from "../services/security.service.js";

const router = express.Router();

router.post("/bookings", async (req, res, next) => {
  try {
    try {
      const response = await bookingService.createClientBooking({
        context: securityService.assertClientContext(req.context),
        parkingSpotId: req.body.parkingSpotId,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/bookings", async (req, res, next) => {
  try {
    const response = await bookingService.getAllClientBookings({
      context: securityService.assertClientContext(req.context),
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.get("/bookings/:bookingId", async (req, res, next) => {
  try {
    const response = await bookingService.getClientBooking({
      context: securityService.assertClientContext(req.context),
      bookingId: req.params.bookingId,
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.put("/bookings/:bookingId", async (req, res, next) => {
  try {
    const response = await bookingService.updateClientBooking({
      context: securityService.assertClientContext(req.context),
      bookingId: req.params.bookingId,
      parkingSpotId: req.body.parkingSpotId,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
    });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.delete("/bookings/:bookingId", async (req, res, next) => {
  try {
    const response = await bookingService.deleteClientBooking({
      context: securityService.assertClientContext(req.context),
      bookingId: req.params.bookingId,
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

export { router as clientRouter };

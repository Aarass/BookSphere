import {
  CreateBookClubDto,
  isValidCreateBookClubDto,
} from "@interfaces/dtos/bookClubDto";
import express from "express";
import createHttpError from "http-errors";
import bookClubService from "../services/bookClubService";
import { authenticate } from "../middlewares/authenticate";

let router = express.Router();

router.post("/book-clubs", async (req, res, next) => {
  let body = req.body as Partial<CreateBookClubDto>;
  if (!isValidCreateBookClubDto(body)) {
    return next(createHttpError(400, "Bad request"));
  }

  try {
    let newClub = await bookClubService.createBookClub(body);
    res.status(200).send(newClub);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.get("/book-clubs", async (req, res, next) => {
  try {
    let clubs = await bookClubService.getAllBookClubs();
    res.status(200).send(clubs);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.get("/book-clubs/joined", authenticate, async (req, res, next) => {
  let userId = req.session.data.userId!;
  try {
    let clubs = await bookClubService.getJoinedBookClubs(userId);
    res.status(200).send(clubs);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.post("/book-clubs/:id/join", authenticate, async (req, res, next) => {
  let bookClubId = req.params["id"];
  let userId = req.session.data.userId!;

  try {
    await bookClubService.joinBookClub(bookClubId, userId);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.post("/book-clubs/:id/leave", authenticate, async (req, res, next) => {
  let bookClubId = req.params["id"];
  let userId = req.session.data.userId!;

  try {
    await bookClubService.leaveBookClub(bookClubId, userId);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

export default router;

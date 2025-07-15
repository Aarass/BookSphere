import {
  CreateBookClubDto,
  isValidCreateBookClubDto,
} from "@interfaces/dtos/bookClubDto";
import express from "express";
import createHttpError from "http-errors";
import bookClubService from "../services/bookClubService";
import { authenticate } from "../middlewares/authenticate";
import roomService from "../services/roomService";
import messageService from "../services/messageService";
import { CreateRoomDto, isValidCreateRoomDto } from "@interfaces/dtos/roomDto";
import {
  isValidReadMessagesDto,
  ReadMessagesDto,
} from "@interfaces/dtos/messageDto";

let router = express.Router();

router.post("/book-clubs", authenticate, async (req, res, next) => {
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
  let userId = req.session.data?.userId ?? null;

  try {
    let clubs = await bookClubService.getAllBookClubs(userId);
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

router.get("/book-clubs/:id", async (req, res, next) => {
  let bookClubId = req.params["id"];
  let userId = req.session.data?.userId ?? null;

  try {
    let club = await bookClubService.getBookClub(bookClubId, userId);
    res.status(200).send(club);
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

router.get("/book-clubs/:id/rooms", async (req, res, next) => {
  let bookClubId = req.params["id"];

  try {
    let rooms = await roomService.getAllInBookClub(bookClubId);
    res.status(200).send(rooms);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.post("/book-clubs/:id/rooms", authenticate, async (req, res, next) => {
  let bookClubId = req.params["id"];

  let body = req.body as Partial<CreateRoomDto>;
  if (!isValidCreateRoomDto(body)) {
    return next(createHttpError(400, "Bad request"));
  }

  try {
    let room = await roomService.createRoom(bookClubId, body);
    res.status(200).send(room);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.get("/book-clubs/:clubId/rooms/:roomId", async (req, res, next) => {
  let bookClubId = req.params["clubId"];
  let roomId = req.params["roomId"];

  try {
    let room = await roomService.getRoomById(bookClubId, roomId);
    res.status(200).send(room);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

router.post("/book-clubs/:bid/rooms/:rid/messages", async (req, res, next) => {
  let bookClubId = req.params["bid"];
  let roomId = req.params["rid"];
  let body = req.body as Partial<ReadMessagesDto>;
  if (!isValidReadMessagesDto(body)) {
    return next(createHttpError(400, "Bad request"));
  }

  try {
    let messages = await messageService.getMessages(body, bookClubId, roomId);
    res.status(200).send(messages);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, "Fail"));
  }
});

export default router;

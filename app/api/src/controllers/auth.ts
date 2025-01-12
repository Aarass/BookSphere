import express from "express";
import authService from "../services/auth";
import { LoginDto } from "@interfaces/dtos/login";
import { Genre } from "@interfaces/genre";

let user: Genre = {
  id: "",
  name: "",
};

let router = express.Router();

// TODO
// add all fileds
declare module "express-serve-static-core" {
  interface Request {
    session: {
      data: {
        userId?: number;
      };
    };
  }
}

router.post("/login", function (req, res, next) {
  const dto = req.body as LoginDto;

  authService.login("Aaras", "password");

  req.session.data = {
    userId: 1,
  };

  res.send("respond with a resource");
});

router.post("/register", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;

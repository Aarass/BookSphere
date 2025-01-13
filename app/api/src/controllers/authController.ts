import express from "express";
import authService from "../services/authService";
import { isValidLoginDto, LoginDto } from "@interfaces/dtos/loginDto";
import createHttpError from "http-errors";
import { isValidRegisterDto, RegisterDto } from "@interfaces/dtos/registerDto";

let router = express.Router();

// TODO
// add all fileds
declare module "express-serve-static-core" {
  interface Request {
    session: {
      data: {
        userId?: string;
      };
    };
  }
}

router.post("/login", async (req, res, next) => {
  try {
    const body = req.body as Partial<LoginDto>;
    if (!isValidLoginDto(body)) {
      return next(createHttpError(400, `Bad request`));
    }

    let user = await authService.login(body);

    req.session.data = {
      userId: user.id,
    };

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(401, `Login failed`));
  }
});

router.post("/register", async (req, res, next) => {
  const body = req.body as Partial<RegisterDto>;
  if (!isValidRegisterDto(body)) {
    return next(createHttpError(400, `Bad request`));
  }

  try {
    await authService.register(body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, `Register failed`));
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    (req.session as any).destroy();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return next(createHttpError(400, `Logout failed`));
  }
});

export default router;

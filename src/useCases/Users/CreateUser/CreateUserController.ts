import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import jwt from "jsonwebtoken";
import config from "../../../config/config";

import { z } from "zod";

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  type: z.string().optional(),
});

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, image, type } = createUserSchema.parse(req.body);

      const userData = await this.createUserUseCase.execute({
        name,
        email,
        image,
        type,
      });

      // Ao criar o usuário, já faz o login
      const token = jwt.sign({ id: userData.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

      return res
        .status(201)
        .cookie("pontuandoAuthToken", token, {
          httpOnly: true,
          // secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 * 1,
        })
        .json({
          success: true,
          message: "User created successfully",
          data: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            type: userData.type,
          },
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({ success: false, message: "Error: Invalid data", error: error.issues });
      }
      next(error);
    }
  };
}

import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords } from "../utils/hashPassword.js";
import generateAuthToken from "../utils/generateAuthToken.js";
import dotenv from "dotenv";

const prisma = new PrismaClient();

dotenv.config();

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res.status(400).send("user exists");
    } else {
      const hashedPassword = hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user.id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        )
        .status(201)
        .json({
          success: "User created",
          userCreated: {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
    }
  } catch (err) {
    next(err);
  }
};

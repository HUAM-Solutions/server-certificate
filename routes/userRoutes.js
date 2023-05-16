import { Router } from "express";
import {
  verifyIsLoggedIn,
  verifyIsAdmin,
} from "../middleware/verifyAuthToken.js";
import { getUsers, registerUser } from "../controllers/userController.js";

const router = Router();

router.post("/register", registerUser);

// user logged in routes:
//router.use(verifyIsLoggedIn);

// admin routes:
//router.use(verifyIsAdmin);
router.get("/", getUsers);

export default router;

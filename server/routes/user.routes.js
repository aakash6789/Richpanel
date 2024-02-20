import { Router } from "express";
import { registerUser,logOutUser,loginUser,refreshAccessToken,updatePassword,getCurrUser,updateAccountDetails } from "../controllers/user.controller.js";
// import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',verifyJWT,logOutUser);
router.post('/refresh-token',refreshAccessToken);
router.post('/change-pass',verifyJWT,updatePassword);
router.get('/curr-user',verifyJWT,getCurrUser);


export default router;
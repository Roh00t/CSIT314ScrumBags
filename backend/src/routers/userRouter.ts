import { NextFunction, Request, Response, Router } from "express";
import { LoginController } from "../controllers/authControllers";

const userRouter = Router()

userRouter.get("/login", async (req: Request, res: Response, _: NextFunction) => {
    const { username, password } = req.body

    const controller = new LoginController()
    const loginSuccess = await controller.login(username, password) 
    res.json(loginSuccess) 
})

export default userRouter
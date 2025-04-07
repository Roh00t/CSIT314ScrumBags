import { NextFunction, Request, Response, Router } from "express";

const userRouter = Router()

userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    
})

export default userRouter
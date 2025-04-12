"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const userRouter = (0, express_1.Router)();
userRouter.get("/login", (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const controller = new authControllers_1.LoginController();
    const loginSuccess = yield controller.login(username, password);
    res.json(loginSuccess);
}));
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map
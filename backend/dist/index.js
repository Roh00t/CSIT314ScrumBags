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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'lsijefljfosjjljij',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
        secure: process.env.NODE_ENV === 'prod'
    }
}));
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hello from the server");
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    res.status(200).json({ "Here's the data we received: ": data });
}));
const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server listening on port", APP_PORT);
}));
//# sourceMappingURL=index.js.map
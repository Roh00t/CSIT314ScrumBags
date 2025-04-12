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
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../misc/schema");
const constants_1 = require("../misc/constants");
class UserAccount {
    constructor() {
        this.db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL); // Establish database connection
    }
    /**
     * @param password The PLAINTEXT password (not encoded)
     */
    createNewUserAccount(createAs, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(constants_1.GLOBALS.SALT_ROUNDS);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const [userProfile] = yield this.db.select()
                .from(schema_1.userProfilesTable)
                .where((0, drizzle_orm_1.eq)(schema_1.userProfilesTable.label, createAs));
            if (!userProfile)
                return false;
            yield this.db.insert(schema_1.userAccountsTable)
                .values({
                username: username,
                password: hashedPassword,
                userProfileId: userProfile.id,
            });
            return true;
        });
    }
    /**
     * @param password The PLAINTEXT password (not encoded)
     */
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const [retrievedUser] = yield this.db
                .select().from(schema_1.userAccountsTable)
                .where((0, drizzle_orm_1.eq)(schema_1.userAccountsTable.username, username));
            if (!retrievedUser)
                return false;
            let isLoginSuccessful = false;
            bcrypt_1.default.compare(password, retrievedUser.password, (err, res) => {
                if (err)
                    isLoginSuccessful = false;
                if (res)
                    isLoginSuccessful = true;
            });
            return isLoginSuccessful;
        });
    }
}
exports.default = UserAccount;
//# sourceMappingURL=userAccount.js.map
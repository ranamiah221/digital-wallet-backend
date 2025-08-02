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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const userToken_1 = require("../../utils/userToken");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = payload, rest = __rest(payload, ["password"]);
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ password: hashedPassword }, rest));
    yield wallet_model_1.Wallet.create({
        userId: user._id
    });
    return user;
});
const credentialLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found.");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect Password.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    const userToken = (0, userToken_1.createUserToken)(user);
    return {
        user: rest,
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
const changedPassword = (decodedToken, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not Exits");
    }
    const isOldPasswordMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password Does Not Match");
    }
    user.password = yield bcrypt_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_ROUND));
    yield user.save();
});
exports.AuthService = {
    credentialLogin,
    createUser,
    getNewAccessToken,
    changedPassword
};

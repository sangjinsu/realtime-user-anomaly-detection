import {Request} from "express";

export type JwtRequest = Request & {
    user?: any;
};
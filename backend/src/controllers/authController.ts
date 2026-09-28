import type {Request,Response} from "express";
import {loginSchema,registerSchema} from "../schemas/auth.js";
import {login,logout,refresh,register} from "../services/authService.js";
import {refreshCookieName} from "../services/tokenService.js";
const cookieOptions={httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/api/auth"};
function setRefresh(res:Response,session:{raw:string;expiresAt:Date}){res.cookie(refreshCookieName,session.raw,{...cookieOptions,expires:session.expiresAt});}
export async function registerController(req:Request,res:Response){const result=await register(registerSchema.parse(req.body));setRefresh(res,result.refresh);res.status(201).json({user:result.user,accessToken:result.accessToken});}
export async function loginController(req:Request,res:Response){const result=await login(loginSchema.parse(req.body));setRefresh(res,result.refresh);res.json({user:result.user,accessToken:result.accessToken});}
export async function refreshController(req:Request,res:Response){const result=await refresh(req.cookies[refreshCookieName]);setRefresh(res,result.refresh);res.json({user:result.user,accessToken:result.accessToken});}
export async function logoutController(req:Request,res:Response){await logout(req.cookies[refreshCookieName]);res.clearCookie(refreshCookieName,cookieOptions);res.status(204).send();}
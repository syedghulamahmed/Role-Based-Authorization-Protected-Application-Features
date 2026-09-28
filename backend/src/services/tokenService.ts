import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import {prisma} from "../prisma.js";
import {config} from "../config.js";
import type {SafeUser} from "../types/auth.js";
export const refreshCookieName="tb_refresh";
export function signAccessToken(user:SafeUser){return jwt.sign({sub:user.id,email:user.email,name:user.name,role:user.role,type:"access"},config.jwtAccessSecret,{expiresIn:config.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"]});}
export function hashRefreshToken(raw:string){return crypto.createHash("sha256").update(raw).digest("hex");}
export async function issueRefreshSession(userId:string){const raw=crypto.randomBytes(48).toString("base64url");const expiresAt=new Date(Date.now()+config.refreshTokenDays*86400000);await prisma.refreshToken.create({data:{userId,tokenHash:hashRefreshToken(raw),expiresAt}});return{raw,expiresAt};}
export async function revokeRefreshToken(raw:string){await prisma.refreshToken.updateMany({where:{tokenHash:hashRefreshToken(raw),revokedAt:null},data:{revokedAt:new Date()}});}
export async function rotateRefreshSession(raw:string){const old=await prisma.refreshToken.findUnique({where:{tokenHash:hashRefreshToken(raw)}});if(!old||old.revokedAt||old.expiresAt<=new Date())return null;await prisma.refreshToken.update({where:{id:old.id},data:{revokedAt:new Date()}});return{userId:old.userId,...await issueRefreshSession(old.userId)};}
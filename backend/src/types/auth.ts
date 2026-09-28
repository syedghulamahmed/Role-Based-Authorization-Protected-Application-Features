import type {UserRole} from "@prisma/client";
import type {Request} from "express";
export type SafeUser={id:string;email:string;name:string;role:UserRole};
export type AuthRequest=Request&{user?:SafeUser};
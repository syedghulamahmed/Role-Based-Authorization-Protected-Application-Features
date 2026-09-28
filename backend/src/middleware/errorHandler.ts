import type {ErrorRequestHandler,RequestHandler} from "express";
import {ZodError} from "zod";
export class AppError extends Error{constructor(public status:number,public code:string,message:string,public details?:unknown){super(message);}}
export const notFound:RequestHandler=(_req,res)=>res.status(404).json({error:{code:"NOT_FOUND",message:"Route not found"}});
export const errorHandler:ErrorRequestHandler=(error,_req,res,_next)=>{
 if(error instanceof ZodError){res.status(422).json({error:{code:"VALIDATION_ERROR",message:"Request validation failed",details:error.flatten()}});return;}
 if(error instanceof AppError){res.status(error.status).json({error:{code:error.code,message:error.message,...(error.details?{details:error.details}:{})}});return;}
 console.error("Unhandled request error:",error instanceof Error?error.message:"unknown");
 res.status(500).json({error:{code:"INTERNAL_ERROR",message:"An unexpected error occurred"}});
};
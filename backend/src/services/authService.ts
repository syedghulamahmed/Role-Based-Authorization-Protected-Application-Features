import bcrypt from "bcrypt";
import {prisma} from "../prisma.js";
import {AppError} from "../middleware/errorHandler.js";
import type {LoginInput,RegisterInput} from "../schemas/auth.js";
import {issueRefreshSession,rotateRefreshSession,revokeRefreshToken,signAccessToken} from "./tokenService.js";
import type {SafeUser} from "../types/auth.js";
const select={id:true,email:true,name:true,role:true,isActive:true} as const;
export async function register(input:RegisterInput){
 if(input.role==="ADMIN")throw new AppError(403,"ADMIN_REGISTRATION_DISABLED","Admin accounts are provisioned by administrators");
 if(await prisma.user.findUnique({where:{email:input.email}}))throw new AppError(409,"EMAIL_IN_USE","An account with this email already exists");
 if(input.role==="STUDENT"&&(!input.university||!input.graduationYear))throw new AppError(422,"PROFILE_REQUIRED","Student profile fields are required");
 if(input.role==="COMPANY"&&!input.companyName)throw new AppError(422,"PROFILE_REQUIRED","Company profile fields are required");
 const passwordHash=await bcrypt.hash(input.password,12);
 const user=await prisma.$transaction(async tx=>{const created=await tx.user.create({data:{email:input.email,passwordHash,name:input.name,role:input.role},select});if(input.role==="STUDENT")await tx.student.create({data:{userId:created.id,university:input.university!,graduationYear:input.graduationYear!}});else await tx.company.create({data:{userId:created.id,companyName:input.companyName!,website:input.website}});return created;});
 return session(user);
}
export async function login(input:LoginInput){const row=await prisma.user.findUnique({where:{email:input.email},select:{...select,passwordHash:true}});if(!row||!row.isActive||!(await bcrypt.compare(input.password,row.passwordHash)))throw new AppError(401,"INVALID_CREDENTIALS","Email or password is incorrect");return session(row);}
async function session(user:SafeUser){const refresh=await issueRefreshSession(user.id);return{user,accessToken:signAccessToken(user),refresh};}
export async function refresh(raw:string|undefined){if(!raw)throw new AppError(401,"NO_REFRESH_SESSION","Refresh session is missing");const rotated=await rotateRefreshSession(raw);if(!rotated)throw new AppError(401,"INVALID_REFRESH_SESSION","Refresh session is invalid or expired");const row=await prisma.user.findUnique({where:{id:rotated.userId},select});if(!row||!row.isActive)throw new AppError(401,"INVALID_REFRESH_SESSION","Refresh session user is inactive");return{user:row,accessToken:signAccessToken(row),refresh:rotated};}
export async function logout(raw:string|undefined){if(raw)await revokeRefreshToken(raw);}
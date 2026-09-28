const API=import.meta.env.VITE_API_URL??"http://localhost:4000/api";
export type User={id:string;email:string;name:string;role:"STUDENT"|"COMPANY"|"ADMIN";isActive:boolean};
let accessToken:string|null=null;
export function setAccessToken(token:string|null){accessToken=token;}
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{const headers=new Headers(options.headers);headers.set("Content-Type","application/json");if(accessToken)headers.set("Authorization",`Bearer ${accessToken}`);const response=await fetch(API+path,{...options,headers,credentials:"include"});const body=await response.json().catch(()=>undefined);if(!response.ok){const error=new Error(body?.error?.message??"Request failed") as Error&{status?:number};error.status=response.status;throw error;}return body as T;}
export async function refresh(){const result=await api<{user:User;accessToken:string}>("/auth/refresh",{method:"POST"});setAccessToken(result.accessToken);return result;}
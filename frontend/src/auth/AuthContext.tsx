import {createContext,useCallback,useContext,useEffect,useMemo,useState} from "react";import {api,refresh,setAccessToken,type User} from "../services/api";
type Ctx={user:User|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>};
const AuthContext=createContext<Ctx|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){const[user,setUser]=useState<User|null>(null);const[loading,setLoading]=useState(true);
useEffect(()=>{refresh().then(r=>setUser(r.user)).catch(()=>{}).finally(()=>setLoading(false));},[]);
const login=useCallback(async(email:string,password:string)=>{const r=await api<{user:User;accessToken:string}>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});setAccessToken(r.accessToken);setUser(r.user);},[]);
const logout=useCallback(async()=>{try{await api<void>("/auth/logout",{method:"POST"});}finally{setAccessToken(null);setUser(null);}},[]);
const value=useMemo(()=>({user,loading,login,logout}),[user,loading,login,logout]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error("useAuth must be used inside AuthProvider");return c}
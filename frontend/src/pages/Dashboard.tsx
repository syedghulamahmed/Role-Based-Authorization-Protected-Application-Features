import {useEffect,useState} from "react";
import {useAuth} from "../auth/AuthContext";
import {api} from "../services/api";
import {RoleGate} from "../components/RoleGate";
export function Dashboard(){
 const{user,logout}=useAuth(); const[data,setData]=useState<any[]>([]); const[apps,setApps]=useState<any[]>([]); const[error,setError]=useState("");
 useEffect(()=>{const path=user?.role==="COMPANY"?"/internships/mine":"/internships";api<{items:any[]}>(path).then(r=>setData(r.items)).catch(e=>setError(e.message));if(user?.role==="STUDENT"||user?.role==="COMPANY")api<{items:any[]}>("/applications").then(r=>setApps(r.items)).catch(e=>setError(e.message));},[user]);
 return <main className="shell"><header className="top"><div><span className="badge">{user?.role}</span><h1>Welcome, {user?.name}</h1><p>{user?.email}</p></div><button onClick={logout}>Log out</button></header>
 <section className="grid">
  <section className="card"><h2>{user?.role==="COMPANY"?"Your internships":"Available internships"}</h2>{error?<p className="error">{error}</p>:data.map(item=><article className="item" key={item.id}><strong>{item.title}</strong><span>{item.location}</span><small>{item.company?.companyName}</small></article>)}</section>
  <RoleGate roles={["STUDENT"]}><section className="card"><h2>Your applications</h2>{apps.map(a=><article className="item" key={a.id}><strong>{a.internship?.title}</strong><span>{a.status}</span></article>)}<p className="hint">The backend filters applications by your student identity.</p></section></RoleGate>
  <RoleGate roles={["COMPANY"]}><section className="card"><h2>Applicants to your postings</h2>{apps.map(a=><article className="item" key={a.id}><strong>{a.student?.user?.name}</strong><span>{a.status} · {a.internship?.title}</span></article>)}<p className="hint">The backend only returns applications for your postings.</p></section></RoleGate>
  <RoleGate roles={["ADMIN"]}><section className="card"><h2>Admin moderation</h2><p>Users and internships can be moderated from protected admin routes.</p><a href="/admin">Open admin panel</a></section></RoleGate>
 </section></main>
}
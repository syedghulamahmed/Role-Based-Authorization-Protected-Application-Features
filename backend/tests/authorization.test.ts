import test from "node:test";
import assert from "node:assert/strict";
import {assertOwnership,requireRole} from "../src/middleware/auth.js";
test("company cannot edit another company's internship",()=>{assert.throws(()=>assertOwnership("company-A","company-B"),(error:any)=>error.status===403&&error.code==="FORBIDDEN");});
test("student cannot view another student's application",()=>{assert.throws(()=>assertOwnership("student-A","student-B"),(error:any)=>error.status===403&&error.code==="FORBIDDEN");});
test("admin role passes the admin role gate",()=>{let called=false;const middleware=requireRole("ADMIN");middleware({user:{id:"1",email:"a",name:"Admin",role:"ADMIN"}} as any,{} as any,()=>{called=true;});assert.equal(called,true);});
test("company role is denied by the admin role gate",()=>{let status=0;const middleware=requireRole("ADMIN");middleware({user:{id:"1",email:"c",name:"Company",role:"COMPANY"}} as any,{ } as any,(error:any)=>{status=error.status;});assert.equal(status,403);});
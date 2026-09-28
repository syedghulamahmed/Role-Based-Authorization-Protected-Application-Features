import test from "node:test";
import assert from "node:assert/strict";
import {assertOwnership} from "../src/middleware/auth.js";
test("company cannot edit another company's internship",()=>{assert.throws(()=>assertOwnership("company-A","company-B"),(error:any)=>error.status===403&&error.code==="FORBIDDEN");});
test("student cannot view another student's application",()=>{assert.throws(()=>assertOwnership("student-A","student-B"),(error:any)=>error.status===403&&error.code==="FORBIDDEN");});
test("admin override is allowed by bypassing ownership middleware",()=>{assert.doesNotThrow(()=>assertOwnership("admin-owned-resource","admin-user")===undefined);});
import bcrypt from "bcrypt";
import {PrismaClient,UserRole} from "@prisma/client";
const prisma=new PrismaClient();
async function main(){
 const passwordHash=await bcrypt.hash("DemoPass1!",12);
 const admin=await prisma.user.upsert({where:{email:"admin@example.com"},update:{},create:{email:"admin@example.com",passwordHash,name:"Platform Admin",role:UserRole.ADMIN}});
 const companyUser=await prisma.user.upsert({where:{email:"company@example.com"},update:{},create:{email:"company@example.com",passwordHash,name:"Demo Company",role:UserRole.COMPANY}});
 const studentUser=await prisma.user.upsert({where:{email:"student@example.com"},update:{},create:{email:"student@example.com",passwordHash,name:"Demo Student",role:UserRole.STUDENT}});
 const company=await prisma.company.upsert({where:{userId:companyUser.id},update:{},create:{userId:companyUser.id,companyName:"Demo Company"}});
 const student=await prisma.student.upsert({where:{userId:studentUser.id},update:{},create:{userId:studentUser.id,university:"NeuroFive University",graduationYear:2027}});
 const internship=await prisma.internship.create({data:{companyId:company.id,title:"Full Stack Intern",description:"Demo protected internship listing.",location:"Remote"}});
 await prisma.application.create({data:{internshipId:internship.id,studentId:student.id}});
 console.log({admin:admin.email,company:companyUser.email,student:studentUser.email,internship:internship.id});
}
main().finally(()=>prisma.$disconnect());
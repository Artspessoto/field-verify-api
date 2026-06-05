import { User } from "@prisma/client";
import { hash } from "bcrypt";
import prisma from "../../src/lib/prisma";
import { UserBodySchema } from "../../src/schemas/user.schema";
import { encrypt } from "../../src/utils/crypto";

async function createAdminUser(): Promise<User | void> {
  const adminData: UserBodySchema = {
    name: "Posso ser adm?",
    email: "admin@example.com",
    document: "52998224725", //valid cpf for test
    password: "admin123",
    role: "ADMIN",
  };

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (existingAdmin) {
    console.info("Admin already exists.");
    return;
  }

  const hashedPassword = await hash(adminData.password, 8);
  const cleanCpf = adminData.document.replace(/\D/g, "");
  const encryptedCpf = encrypt(cleanCpf);

  await prisma.user.create({
    data: {
      name: adminData.name,
      email: adminData.email,
      document: encryptedCpf,
      role: adminData.role,
      password_hash: hashedPassword,
    },
  });

  console.info(
    `Admin created with email: ${adminData.email} and password: ${adminData.password}`,
  );
}

createAdminUser()
  .then(() => {
    console.info("Finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error to create admin:", error);
    process.exit(1);
  });

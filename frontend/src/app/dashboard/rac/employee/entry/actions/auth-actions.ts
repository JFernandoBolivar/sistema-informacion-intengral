"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/db/client";
import { registerSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    const { data, success } = registerSchema.safeParse(values);

    if (!success) {
      return { error: "Invalid data" };
    }

    const user = await prisma.user.findUnique({
      where: {
        cedula: data.cedula,
      },
    });

    if (user) {
      return { error: "User already exists" };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        cedula: data.cedula,
        name: data.name,
        password: passwordHash,
      },
    });

    await signIn("credentials", {
      cedula: values.cedula,
      password: values.password,
      name: values.name,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
};

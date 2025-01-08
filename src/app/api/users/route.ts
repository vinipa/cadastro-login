import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { validateRegistration } from "@/utils/validateForm";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const validationError = validateRegistration(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { name, email, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}

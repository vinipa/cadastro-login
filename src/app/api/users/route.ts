import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  validatePasswordChange,
  validateRegistration,
  validateUsernameChange,
} from "@/utils/validateForm";

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (password) {
      const validationError = validatePasswordChange(body);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    if (name) {
      const validationError = validateUsernameChange(body);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    if (req.method !== "PUT") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      throw new Error("user does not exists!");
    }

    const updatedData: { name?: string; password?: string } = { name };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: updatedData,
    });

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "An error occurred during the update" },
      { status: 500 }
    );
  }
}

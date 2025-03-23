import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST - Registrácia používateľa
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, recaptchaToken } = body;

    // 1. Kontrola vstupov
    if (!name || !email || !password || !recaptchaToken) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 2. Overenie reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${recaptchaToken}`,
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ message: "reCAPTCHA verification failed" }, { status: 400 });
    }

    // 3. Duplicitný email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 4. Hashovanie hesla
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Vytvorenie používateľa
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


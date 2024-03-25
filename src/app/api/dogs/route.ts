import { NextResponse } from "next/server";
import { addDog, getDogs } from "./dogs";

export function GET(_: Request) {
  return NextResponse.json(getDogs());
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string) || "";
    const breed = (formData.get("breed") as string) || "";
    const newDog = addDog(name, breed);
    return NextResponse.json(newDog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

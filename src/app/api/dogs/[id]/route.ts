import { NextResponse } from "next/server";
import { deleteDog, updateDog } from "../dogs";

type Props = {
  params: { id: string };
};

export async function DELETE(req: Request, { params: { id } }: Props) {
  const existed = deleteDog(id);
  return NextResponse.json(
    { error: "dog not found" },
    { status: existed ? 200 : 404 }
  );
}

export async function PUT(req: Request, { params: { id } }: Props) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const breed = formData.get("breed") as string;
  const dog = updateDog(id, name, breed);
  return dog
    ? NextResponse.json(dog)
    : NextResponse.json({ error: "dog not found" }, { status: 404 });
}

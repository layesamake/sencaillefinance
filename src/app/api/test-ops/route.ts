import { getOperations } from "@/lib/queries/operations";
import { NextResponse } from "next/server";

export async function GET() {
  const ops = await getOperations();
  return NextResponse.json({ ops });
}

import { isAddress } from "ethers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { address } = body;

    if (!address) {
        return NextResponse.json({ valid: false, error: "Dirección requerida" }, { status: 400 });
    }

    const valid = isAddress(address);

    return NextResponse.json({ valid });
}
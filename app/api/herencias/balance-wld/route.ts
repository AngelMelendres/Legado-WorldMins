import { NextResponse } from "next/server";
import { createPublicClient, http, formatEther } from "viem";

// World Chain config
const WLD_CONTRACT = "0x2cfc85d8e48f8eab294be644d9e25c3030863003";
const ALCHEMY_RPC = "https://worldchain-mainnet.g.alchemy.com/v2/mtea97CBtbHi3YKRpuIS8BrQ0uNL69da";
const WORLD_CHAIN_ID = 480;

const WLD_ABI = [
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

export async function POST(req: Request) {
    try {
        const { wallet } = await req.json();

        if (!wallet || typeof wallet !== "string") {
            return NextResponse.json({ error: "Wallet no proporcionada o inválida" }, { status: 400 });
        }

        const client = createPublicClient({
            chain: {
                id: WORLD_CHAIN_ID,
                name: "World Chain",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: {
                    default: { http: [ALCHEMY_RPC] },
                    public: { http: [ALCHEMY_RPC] },
                },
            },
            transport: http(ALCHEMY_RPC),
        });

        const rawBalance = await client.readContract({
            address: WLD_CONTRACT,
            abi: WLD_ABI,
            functionName: "balanceOf",
            args: [wallet],
        });

        const formattedBalance = parseFloat(formatEther(rawBalance));
        return NextResponse.json({ balance: formattedBalance });
    } catch (err) {
        console.error("❌ Error en balance-wld API:", err);
        return NextResponse.json({ error: "No se pudo obtener el balance" }, { status: 500 });
    }
}

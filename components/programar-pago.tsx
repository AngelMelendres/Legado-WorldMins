"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import PaymentABI from "@/abi/PaymentABI.json";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http, parseUnits } from "viem";
import { Button } from "@/components/ui/button";

const CONTRACT_ADDRESS = "0x7A90E10E9Efe5F796Be0A429aa846f457e15358D";
const TOKEN_ADDRESS = "0x163f8c2467924be0ae7b5347228cabf260318753";

const worldchain = {
  id: 88882,
  name: "World Chain",
  network: "worldchain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-mainnet.g.alchemy.com/public"],
    },
    public: {
      http: ["https://worldchain-mainnet.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "Worldchain Explorer",
      url: "https://worldchain-mainnet.explorer.alchemy.com",
    },
  },
} as const;

export default function ProgramarPagoMiniApp() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [transactionId, setTransactionId] = useState<string>("");

  const client = createPublicClient({
    chain: worldchain,
    transport: http(),
  });

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.APP_ID!,
    },
    transactionId,
  });

  const programarPago = async () => {
    if (!recipient || !amount || !date) {
      alert("❗ Todos los campos son obligatorios");
      return;
    }

    try {
      const releaseTime = Math.floor(new Date(date).getTime() / 1000);
      const value = parseUnits(amount, 18);

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: CONTRACT_ADDRESS,
            abi: PaymentABI,
            functionName: "schedulePayment",
            args: [TOKEN_ADDRESS, recipient, value, releaseTime],
          },
        ],
      });

      if (finalPayload.status === "success") {
        setTransactionId(finalPayload.transaction_id);
        alert("✅ Transacción enviada correctamente");
      } else if (finalPayload.status === "error") {
        if (finalPayload.error_code === "user_rejected") {
          alert("❌ Transacción cancelada por el usuario.");
        } else {
          console.error("Error al enviar transacción:", finalPayload);
          alert(
            "❌ Error al enviar la transacción: " + finalPayload.description
          );
        }
      }
    } catch (err: any) {
      console.error("❌ Excepción:", err);
      alert("❌ Error inesperado: " + err.message);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <h2 className="text-white font-semibold text-lg text-center">
        Generar Contrato Inteligente
      </h2>

      <input
        type="text"
        placeholder="Wallet destino"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full rounded px-3 py-2 text-sm text-black"
      />

      <input
        type="number"
        placeholder="Cantidad en WLD"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded px-3 py-2 text-sm text-black"
      />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded px-3 py-2 text-sm text-black"
      />

      <Button onClick={programarPago} className="w-full">
        Enviar desde World App
      </Button>

      {isLoading && (
        <p className="text-yellow-400 text-center text-sm">
          ⏳ Confirmando transacción...
        </p>
      )}
      {isSuccess && (
        <p className="text-green-400 text-center text-sm">
          ✅ ¡Transacción confirmada!
        </p>
      )}
    </div>
  );
}

// components/WorldcoinTransaction.tsx
"use client";

import ForwardABI from "@/abi/PaymentABI.json"; // o tu ABI personalizado
import { MiniKit } from "@worldcoin/minikit-js";
import { parseUnits } from "viem"; // Asegúrate de tener esto instalado
const { status, error_code, description } = result.finalPayload;

export const sendWorldcoinTransaction = async (toAddress: string) => {
  try {
    const tokenAddress = "0x163f8c3a070e64f5314f65bdd1fdd935fd6ae6d7";
    const amount = parseUnits("0.00001", 18);
    const releaseTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const result = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: "0x087d5449a126e4e439495fcBc62A853eB3257936",
          abi: ForwardABI,
          functionName: "schedulePayment",
          args: [tokenAddress, toAddress, amount, releaseTime],
        },
      ],
    });

    console.log("Resultado completo del envío:", result);

    const transaction_id =
      result?.commandPayload?.transaction_id ||
      result?.finalPayload?.transaction_id;
    const status =
      result?.commandPayload?.status ||
      result?.finalPayload?.status ||
      "success";

    if (!transaction_id) {
      console.error("No se encontró transaction_id en la respuesta:", result);
    }

    if (status === "error") {
      console.error(`Transacción fallida: ${error_code} - ${description}`);
    } else {
      const transaction_id = result?.finalPayload?.transaction_id;
      console.log("Transacción enviada correctamente. ID:", transaction_id);
      return transaction_id;
    }
  } catch (err) {
    console.error("Excepción al enviar transacción:", err);
  }
};

// components/ProgramarPago.tsx
"use client";

import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x..."; // ← dirección del contrato desplegado
const ABI = [...]; // ← ABI del contrato compilado

export default function ProgramarPago() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [date, setDate] = useState("");

  const programarPago = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const releaseTime = Math.floor(new Date(date).getTime() / 1000);
    const tokenAddress = "0x..."; `// Dirección de $WLD u otro ERC-20 compatible`

    const tx = await contract.schedulePayment(
      tokenAddress,
      recipient,
      ethers.parseUnits(amount, 18),
      releaseTime
    );

    await tx.wait();
    alert("✅ Pago programado correctamente");
  };

  return (
    <div className="p-4 space-y-4">
      <input type="text" placeholder="Wallet destino" onChange={(e) => setRecipient(e.target.value)} />
      <input type="text" placeholder="Cantidad" onChange={(e) => setAmount(e.target.value)} />
      <input type="datetime-local" onChange={(e) => setDate(e.target.value)} />
      <button onClick={programarPago}>Programar Pago</button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, Tokens, tokenToDecimals } from '@worldcoin/minikit-js';

type PaymentButtonProps = {
  amountWLD?: number;
  description?: string;
  onSuccess?: () => void; // ✅ notificación de pago exitoso
};

export default function PaymentButton({
  amountWLD = 0.3,
  description = 'Pago por plan',
  onSuccess,
}: PaymentButtonProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  const onClickPay = async () => {
    try {
      setStatus('pending');
      const address = "0x2043e04f353cfeffb3e7281383fb5ff1ef72ccc0";

      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
      });
      const { id } = await res.json();

      const result = await MiniKit.commandsAsync.pay({
        reference: id,
        to: address,
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(amountWLD, Tokens.WLD).toString(),
          },
        ],
        description,
      });

      if (result.finalPayload.status === 'success') {
        setStatus('success');
        onSuccess?.(); // ✅ llama al padre
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <Button onClick={onClickPay} disabled={status === 'pending'}>
        {status === 'pending' ? 'Procesando...' : 'Pagar'}
      </Button>
      {status === 'success' && <span className="text-green-500 text-sm">✅ Pago exitoso</span>}
      {status === 'failed' && <span className="text-red-500 text-sm">❌ Fallo al procesar el pago</span>}
    </div>
  );
}

"use client";

import TestContractABI from "@/abi/TestContract.json";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";


export const Transaction = () => {
  const myContractToken = "0xF0882554ee924278806d708396F1a7975b732522";
  const myContractSchedule = "0x7A90E10E9Efe5F796Be0A429aa846f457e15358D";
  const tokenAddress = "0x163f8c2467924be0ae7b5347228cabf260318753";
  const receiverWallet = "0x8bF268e7E8753db136e8D5C6E4c6F3D711Fd8C33";

  const [buttonState, setButtonState] = useState<
    "pending" | "success" | "failed" | undefined
  >(undefined);
  const [whichButton, setWhichButton] = useState<
    "getToken" | "usePermit2" | "schedulePayment"
  >("getToken");
  const [transactionId, setTransactionId] = useState<string>("");

  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
    },
    transactionId,
  });

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        console.log("Transaction confirmed!");
        setButtonState("success");
        setTimeout(() => setButtonState(undefined), 3000);
      } else if (isError) {
        console.error("Transaction failed:", error);
        setButtonState("failed");
        setTimeout(() => setButtonState(undefined), 3000);
      }
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId]);

  const onClickGetToken = async () => {
    setTransactionId("");
    setWhichButton("getToken");
    setButtonState("pending");

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: myContractToken,
            abi: TestContractABI,
            functionName: "mintToken",
            args: [],
          },
        ],
      });

      if (finalPayload.status === "success") {
        console.log("Transaction submitted:", finalPayload.transaction_id);
        setTransactionId(finalPayload.transaction_id);
      } else {
        console.error("Mint failed:", finalPayload);
        setButtonState("failed");
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error("Mint error:", err);
      setButtonState("failed");
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  const onClickUsePermit2 = async () => {
    setTransactionId("");
    setWhichButton("usePermit2");
    setButtonState("pending");
    const address = (await MiniKit.getUserByUsername("alex")).walletAddress;

    const permitTransfer = {
      permitted: {
        token: myContractToken,
        amount: (0.5 * 10 ** 18).toString(),
      },
      nonce: Date.now().toString(),
      deadline: Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString(),
    };

    const transferDetails = {
      to: address,
      requestedAmount: (0.5 * 10 ** 18).toString(),
    };

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: myContractToken,
            abi: TestContractABI,
            functionName: "signatureTransfer",
            args: [
              [
                [
                  permitTransfer.permitted.token,
                  permitTransfer.permitted.amount,
                ],
                permitTransfer.nonce,
                permitTransfer.deadline,
              ],
              [transferDetails.to, transferDetails.requestedAmount],
              "PERMIT2_SIGNATURE_PLACEHOLDER_0",
            ],
          },
        ],
        permit2: [
          {
            ...permitTransfer,
            spender: myContractToken,
          },
        ],
      });

      if (finalPayload.status === "success") {
        console.log(
          "Permit2 transaction submitted:",
          finalPayload.transaction_id
        );
        setTransactionId(finalPayload.transaction_id);
      } else {
        console.error("Permit2 failed:", finalPayload);
        setButtonState("failed");
      }
    } catch (err) {
      console.error("Permit2 error:", err);
      setButtonState("failed");
    }
  };

  const onClickSchedulePayment = async () => {
    setTransactionId("");
    setWhichButton("schedulePayment");
    setButtonState("pending");

    const releaseTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const amount = (0.25 * 10 ** 18).toString();

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: myContractSchedule,
            abi: TestContractABI,
            functionName: "schedulePayment",
            args: [tokenAddress, receiverWallet, amount, releaseTime],
          },
        ],
      });

      if (finalPayload.status === "success") {
        console.log(
          "Scheduled payment submitted:",
          finalPayload.transaction_id
        );
        setTransactionId(finalPayload.transaction_id);
      } else {
        console.error("SchedulePayment failed:", finalPayload);
        setButtonState("failed");
      }
    } catch (err) {
      console.error("SchedulePayment error:", err);
      setButtonState("failed");
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Transaction</p>

      <LiveFeedback
        label={{
          failed: "Transaction failed",
          pending: "Transaction pending",
          success: "Transaction successful",
        }}
        state={whichButton === "getToken" ? buttonState : undefined}
        className="w-full"
      >
        <Button
          onClick={onClickGetToken}
          disabled={buttonState === "pending"}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Get Token
        </Button>
      </LiveFeedback>

      <LiveFeedback
        label={{
          failed: "Transaction failed",
          pending: "Transaction pending",
          success: "Transaction successful",
        }}
        state={whichButton === "usePermit2" ? buttonState : undefined}
        className="w-full"
      >
        <Button
          onClick={onClickUsePermit2}
          disabled={buttonState === "pending"}
          size="lg"
          variant="tertiary"
          className="w-full"
        >
          Use Permit2
        </Button>
      </LiveFeedback>

      <LiveFeedback
        label={{
          failed: "Transaction failed",
          pending: "Transaction pending",
          success: "Transaction successful",
        }}
        state={whichButton === "schedulePayment" ? buttonState : undefined}
        className="w-full"
      >
        <Button
          onClick={onClickSchedulePayment}
          disabled={buttonState === "pending"}
          size="lg"
          variant="secondary"
          className="w-full"
        >
          Ejecutar schedulePayment
        </Button>
      </LiveFeedback>
    </div>
  );
};

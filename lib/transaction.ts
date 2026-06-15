import { Wallet, parseEther } from "ethers";
import { provider } from "./provider";

export async function sendPOL(
  privateKey: string,
  to: string,
  amount: string
) {
  const wallet = new Wallet(
    privateKey,
    provider
  );

  const tx = await wallet.sendTransaction({
    to,
    value: parseEther(amount),
  });

  await tx.wait();

  return tx.hash;
}
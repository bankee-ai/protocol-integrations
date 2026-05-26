/**
 * MPP client example — pay for an AI inference API using the Machine Payments Protocol.
 * Bankee handles the Payment authentication scheme automatically.
 */
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

async function callPaidAI(prompt: string) {
  // MPP uses HTTP Authorization headers — no separate payment request needed
  const response = await bankee.mpp.request('https://api.ai-service.com/v1/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, max_tokens: 500 }),
    payment: {
      maxAmount: '0.05',
      currency: 'USDC',
      rail: 'stablecoin',
    },
  });

  const receipt = response.headers.get('Payment-Receipt');
  console.log('Paid:', receipt);
  return response.json();
}

callPaidAI('Summarise the Q3 financial report').then(console.log).catch(console.error);

/**
 * x402 client example — automatically pay for x402-protected resources.
 * Bankee detects the 402 response, pays, and retries transparently.
 */
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

async function fetchPaidResource(url: string) {
  // bankee.x402.fetch is a drop-in replacement for fetch()
  // It handles the 402 → pay → retry cycle automatically
  const response = await bankee.x402.fetch(url, {
    maxAmount: '0.01',     // refuse to pay more than 1 cent
    currency: 'USDC',
    network: 'base',
  });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

fetchPaidResource('https://api.example.com/premium-data')
  .then(data => console.log('Received:', data))
  .catch(console.error);

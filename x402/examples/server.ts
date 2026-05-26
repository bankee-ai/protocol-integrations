/**
 * x402 server example — protect an API endpoint with HTTP 402 payment.
 * Clients must pay 0.001 USDC per request via Bankee as the facilitator.
 */
import express from 'express';
import { BankeeSDK } from '@bankee/sdk';

const app = express();
const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

// Protect /api/data with x402 — 0.001 USDC per call
app.get('/api/data',
  bankee.x402.protect({
    amount: '0.001',
    currency: 'USDC',
    network: 'base',
    scheme: 'exact',
    facilitator: 'bankee', // Bankee acts as the x402 facilitator
  }),
  (req, res) => {
    res.json({ data: 'premium content', paidVia: 'x402' });
  }
);

app.listen(3000, () => console.log('x402-protected server running on :3000'));

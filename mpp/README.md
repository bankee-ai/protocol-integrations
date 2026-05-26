# MPP — Machine Payments Protocol

**Maintainer:** Tempo + Stripe  
**Spec:** [github.com/tempoxyz/mpp-specs](https://github.com/tempoxyz/mpp-specs)  
**Bankee fork:** [github.com/bankee-ai/mpp-specs](https://github.com/bankee-ai/mpp-specs)  
**Live since:** March 2026 · 100+ services at launch

## What is MPP?

The Machine Payments Protocol is an open, internet-native standard for AI agents to pay for resources. It uses HTTP's existing `WWW-Authenticate` / `Authorization` header mechanism — specifically the `Payment` authentication scheme — to embed payment flows directly into the HTTP request/response cycle.

MPP went to mainnet in March 2026 co-authored by Tempo and Stripe, with support for stablecoins (Tempo), credit/debit cards (Stripe + Visa), and Bitcoin Lightning.

## How Bankee Integrates MPP

Bankee implements MPP as both a **payment client** (devices paying for AI services, APIs, or data) and a **payment server** (device manufacturers monetising SDK usage or data streams). The SDK handles the full `Payment` authentication scheme lifecycle.

## Key Concepts

- **`Payment` auth scheme** — extends HTTP authentication; no new request round-trips required
- **Multi-rail** — single protocol, multiple settlement layers (stablecoin, card, Lightning)
- **Receipts** — cryptographically signed payment receipts attached to responses
- **Metered billing** — pay-per-request or pay-per-token consumption models

## Quick Start

```typescript
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

// Make an MPP-authenticated request to a paid API
const response = await bankee.mpp.request('https://api.ai-service.com/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Summarise Q3 financials' }),
  payment: {
    maxAmount: '0.05',
    currency: 'USDC',
    rail: 'stablecoin',
  },
});

// Protect your own API endpoint with MPP
app.use('/api/inference', bankee.mpp.protect({
  pricing: { model: 'per-request', amount: '0.001', currency: 'USDC' },
}));
```

See [`examples/`](./examples) for full server and client implementations.

## Comparison with x402

| Feature | MPP | x402 |
|---------|-----|------|
| Transport | HTTP auth headers | HTTP 402 status + retry |
| Rails | Stablecoin, card, Lightning | On-chain (crypto) |
| Maintainer | Stripe + Tempo | Coinbase |
| Mainnet | March 2026 | 2025 |
| Best for | AI service APIs | General resource access |

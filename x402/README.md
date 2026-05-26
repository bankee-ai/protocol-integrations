# x402 — HTTP 402 Payment Protocol

**Maintainer:** Coinbase (Apache 2.0)  
**Spec:** [github.com/coinbase/x402](https://github.com/coinbase/x402)  
**Bankee fork:** [github.com/bankee-ai/x402](https://github.com/bankee-ai/x402)

## What is x402?

x402 resurrects the dormant HTTP 402 "Payment Required" status code as a fully-featured, on-chain payment layer for APIs, websites, and autonomous agents. It is network, token, and currency agnostic — the first production facilitator is Coinbase, but anyone can implement one.

The core flow is simple: a resource server responds with `402 Payment Required` and a `PaymentRequired` object; the client pays, then retries with a `PAYMENT-SIGNATURE` header.

## How Bankee Integrates x402

Bankee devices can act as both **x402 clients** (paying for API access) and **x402 servers** (monetising device-generated data or capabilities). The Bankee SDK handles:

- Detecting `402` responses and parsing the `PaymentRequired` object
- Selecting the appropriate payment scheme (`exact`, `upto`)
- Signing and submitting the on-chain payment via Coinbase CDP or Bankee's stablecoin rails
- Retrying the original request with the `PAYMENT-SIGNATURE` header

## Key Concepts

- **Facilitator** — a trusted service (Coinbase CDP, or Bankee) that verifies payments and unlocks access
- **Schemes** — `exact` (fixed price), `upto` (pay-as-you-go by resource consumed)
- **Networks** — Base (USDC), Ethereum, and others; Bankee also supports fiat bridging
- **Stateless** — no sessions or pre-registration; any agent can pay any x402-protected resource

## Quick Start

```typescript
// Server: protect an API endpoint with x402
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

// Express middleware
app.use('/api/data', bankee.x402.protect({
  amount: '0.001',
  currency: 'USDC',
  network: 'base',
  scheme: 'exact',
}));

// Client: pay for x402-protected resources automatically
const response = await bankee.x402.fetch('https://api.example.com/data', {
  maxAmount: '0.01',
  currency: 'USDC',
});
```

See [`examples/`](./examples) for server and client implementations.

## Payment Flow

```
Client                    Server                  Facilitator (Bankee)
  │                          │                          │
  │── GET /resource ─────────▶│                          │
  │                          │── 402 PaymentRequired ──▶│
  │◀─ 402 + PaymentRequired ─│                          │
  │                          │                          │
  │── on-chain payment ─────────────────────────────────▶│
  │◀─ PAYMENT-SIGNATURE ────────────────────────────────│
  │                          │                          │
  │── GET /resource ─────────▶│                          │
  │   + PAYMENT-SIGNATURE     │── verify signature ──────▶│
  │                          │◀─ verified ──────────────│
  │◀─ 200 OK + resource ─────│                          │
```

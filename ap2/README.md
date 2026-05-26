# AP2 — Agent Payments Protocol

**Maintainer:** Google / FIDO Alliance  
**Spec:** [github.com/google-agentic-commerce/AP2](https://github.com/google-agentic-commerce/AP2)  
**Bankee fork:** [github.com/bankee-ai/AP2](https://github.com/bankee-ai/AP2)

## What is AP2?

The Agent Payments Protocol (AP2) is Google's open standard for enabling AI agents to initiate payments on behalf of users — securely, with privacy preservation and human oversight built in. It is standardised through FIDO's Agentic Authentication and Payments Technical Working Groups.

AP2 is designed for scenarios where a user delegates payment authority to an AI agent: the agent can discover payment capabilities, negotiate with merchants, and trigger transactions — all within a cryptographically verified trust framework.

## How Bankee Integrates AP2

Bankee's SDK wraps AP2's credential exchange and payment initiation flows, exposing them via a simple `bankee.agentic.createPayment({ protocol: 'ap2' })` call. Under the hood:

1. **Capability Discovery** — the Bankee SDK queries the AP2 `.well-known/ap2` endpoint on the target merchant/service
2. **Credential Exchange** — user's delegated payment credentials are presented via AP2's secure handshake
3. **Payment Initiation** — Bankee routes the underlying payment through the appropriate rail (Open Banking, card, or stablecoin)
4. **Receipt & Audit** — AP2 receipt tokens are stored against the Bankee transaction log

## Key Concepts

- **Delegated Authority** — users grant agents bounded payment permissions (amount limits, merchant categories, time windows)
- **FIDO Authentication** — device-bound keys ensure the agent acts on behalf of a verified user
- **Human-in-the-Loop** — AP2 supports mandatory human approval gates before payment execution
- **Privacy-Preserving** — payment credentials are not exposed to the merchant; Bankee acts as the trusted intermediary

## Quick Start

```typescript
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

const payment = await bankee.agentic.createPayment({
  protocol: 'ap2',
  amount: 2999,       // £29.99
  currency: 'GBP',
  approval: 'human-in-loop',
  agent: {
    id: 'shopping-agent-01',
    capabilities: ['initiate_payment'],
  },
});
```

See [`examples/`](./examples) for full working implementations.

## Relevant AP2 Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /.well-known/ap2` | Merchant capability discovery |
| `POST /ap2/initiate` | Begin payment flow |
| `POST /ap2/confirm` | Human approval confirmation |
| `GET /ap2/receipt/{id}` | Retrieve payment receipt |

# ACP — Agentic Commerce Protocol

**Maintainer:** OpenAI + Stripe  
**Spec:** [github.com/agentic-commerce-protocol/agentic-commerce-protocol](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)  
**Bankee fork:** [github.com/bankee-ai/agentic-commerce-protocol](https://github.com/bankee-ai/agentic-commerce-protocol)  
**Status:** Beta · Live on Etsy, Shopify (1M+ merchants), Walmart

## What is ACP?

The Agentic Commerce Protocol is an open standard for connecting buyers, their AI agents, and businesses to complete purchases seamlessly — from discovery through checkout and fulfilment. Co-maintained by OpenAI and Stripe, ACP defines composable building blocks: cart management, checkout delegation, payment authorisation, and order webhooks.

ACP powers ChatGPT Shopping and processes 50M+ shopping queries daily.

## How Bankee Integrates ACP

Bankee enables **device-initiated ACP commerce**: a smart device (watch, phone, wearable) can act as an ACP buyer agent — browsing, adding to cart, and completing checkout — with payment handled through the Bankee multi-rail SDK. This enables:

- **Wearable shopping** — tap-to-buy from a smartwatch using saved preferences
- **IoT reordering** — connected devices autonomously reordering consumables
- **Agent-delegated checkout** — AI agents completing purchases on behalf of users, with device-bound authentication

## Key Concepts

- **Cart & Feed** — structured product discovery and cart management for agents
- **Delegate Payment** — user pre-authorises an agent to pay up to a limit
- **Delegate Authentication** — device-bound identity for the purchasing agent
- **Order Webhooks** — real-time order status updates to the device/agent

## Quick Start

```typescript
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

// Device-initiated checkout via ACP
const order = await bankee.acp.checkout({
  merchant: 'https://api.merchant.com',
  cart: [
    { productId: 'prod_abc123', quantity: 1 }
  ],
  payment: {
    rail: 'card',          // or 'wero', 'open_banking'
    delegateLimit: 5000,   // £50.00 maximum
  },
  buyer: {
    agentId: 'device-agent-watch-01',
    approval: 'human-in-loop',
  },
});

console.log(`Order ${order.id} placed — status: ${order.status}`);
```

See [`examples/`](./examples) for full implementations including cart management and webhook handling.

## ACP Building Blocks Used by Bankee

| Block | Bankee Usage |
|-------|-------------|
| Cart & Feed | Device agents browse and select products |
| Delegate Payment | Pre-authorised spend limits for device agents |
| Delegate Authentication | Device-bound FIDO keys identify the purchasing agent |
| Orders & Webhooks | Order confirmations pushed to device |

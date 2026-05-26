# A2A — Agent-to-Agent Protocol

**Maintainer:** Linux Foundation (originated by Google)  
**Spec:** [github.com/a2aproject/A2A](https://github.com/a2aproject/A2A)  
**Bankee fork:** [github.com/bankee-ai/A2A](https://github.com/bankee-ai/A2A)

## What is A2A?

The Agent-to-Agent (A2A) Protocol is an open standard enabling communication and interoperability between independent AI agent systems — regardless of the framework, language, or vendor that built them. Donated to the Linux Foundation by Google, A2A defines how agents discover capabilities, negotiate tasks, and collaborate.

A2A is the **communication layer**; payment protocols (AP2, x402, MPP) sit on top of it as the **settlement layer**. The [`google-agentic-commerce/a2a-x402`](https://github.com/google-agentic-commerce/a2a-x402) extension (also forked at [`bankee-ai/a2a-x402`](https://github.com/bankee-ai/a2a-x402)) is the canonical example of this combination.

## How Bankee Uses A2A

Bankee uses A2A as the negotiation and coordination layer before payment. A Bankee-powered device agent can:

1. **Discover** supplier/service agents via A2A's Agent Card mechanism
2. **Negotiate** price, quantity, and terms using A2A task protocols
3. **Trigger payment** via AP2, x402, or MPP once terms are agreed
4. **Confirm fulfilment** via A2A task completion events

This makes Bankee a full-stack agentic commerce participant — not just a payment terminal.

## Key Concepts

- **Agent Card** — JSON descriptor at `/.well-known/agent.json` advertising an agent's capabilities
- **Tasks** — structured units of work with defined input/output schemas
- **Skills** — specific capabilities an agent advertises (e.g. `negotiate_price`, `confirm_order`)
- **Streaming** — real-time task progress via Server-Sent Events

## Quick Start

```typescript
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

// Discover a supplier agent and negotiate a purchase
const negotiation = await bankee.a2a.negotiate({
  agentEndpoint: 'https://supplier.example.com',
  task: {
    skill: 'negotiate_price',
    input: {
      sku: 'COMPONENT-XR7',
      quantity: 1000,
      currency: 'GBP',
      maxBudget: 50000,    // £500.00
    },
  },
});

if (negotiation.status === 'agreed') {
  // Proceed to payment via AP2
  const payment = await bankee.agentic.createPayment({
    protocol: 'ap2',
    amount: negotiation.agreedAmount,
    currency: negotiation.currency,
    approval: 'human-in-loop',
    agent: { id: 'procurement-agent-01', capabilities: ['initiate_payment'] },
    metadata: { negotiationId: negotiation.id },
  });
}
```

See [`examples/`](./examples) for full A2A + AP2 and A2A + x402 implementations.

## A2A + x402 Extension

See [`bankee-ai/a2a-x402`](https://github.com/bankee-ai/a2a-x402) for the combined protocol that enables agents to monetise their A2A services with on-chain payments via x402.

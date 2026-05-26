![bankee.ai](logo.png)

# Bankee Protocol Integrations

Reference implementations and integration guides showing how the Bankee SDK connects to every major agentic and traditional payment protocol.

## Protocols

| Folder | Protocol | Maintainer | Status |
|--------|----------|------------|--------|
| [`/ap2`](./ap2) | Agent Payments Protocol | Google / FIDO | ✅ Integrated |
| [`/x402`](./x402) | HTTP 402 Payment Protocol | Coinbase (Apache 2.0) | ✅ Integrated |
| [`/mpp`](./mpp) | Machine Payments Protocol | Stripe + Tempo | ✅ Integrated |
| [`/acp`](./acp) | Agentic Commerce Protocol | OpenAI + Stripe | ✅ Integrated |
| [`/a2a`](./a2a) | Agent-to-Agent Protocol | Linux Foundation | ✅ Integrated |

## How Bankee Connects

```
                    ┌─────────────────┐
                    │   Bankee SDK    │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐    ┌───────▼──────┐    ┌─────▼──────┐
    │  Google   │    │   Coinbase   │    │   Stripe   │
    │   AP2     │    │    x402      │    │    MPP     │
    └─────┬─────┘    └──────┬───────┘    └─────┬──────┘
          │                 │                  │
          └─────────────────┼──────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Smart Device   │
                   │  (NFC/BLE/SE)   │
                   └─────────────────┘
```

Each protocol folder contains:
- `README.md` — protocol overview, how Bankee integrates, key concepts
- `examples/` — working code showing the integration pattern
- `docs/` — deeper technical notes and edge cases

## Getting Started

1. Install the Bankee SDK: `npm install @bankee/sdk`
2. Pick your protocol(s) from the folders above
3. Follow the README in that folder
4. Run the examples against the Bankee sandbox

## Related Repositories

- [bankee-ai/bankee-sdk](https://github.com/bankee-ai/bankee-sdk) — The SDK itself
- [bankee-ai/AP2](https://github.com/bankee-ai/AP2) — Fork of Google AP2
- [bankee-ai/x402](https://github.com/bankee-ai/x402) — Fork of Coinbase x402
- [bankee-ai/mpp-specs](https://github.com/bankee-ai/mpp-specs) — Fork of MPP specs
- [bankee-ai/agentic-commerce-protocol](https://github.com/bankee-ai/agentic-commerce-protocol) — Fork of ACP
- [bankee-ai/A2A](https://github.com/bankee-ai/A2A) — Fork of A2A

## Contact

| | |
|---|---|
| Integration & technical | mohammed@bankee.ai |
| Commercial & partnerships | Jonathan@bankee.ai |
| Strategic alliances | naved@bankee.ai |

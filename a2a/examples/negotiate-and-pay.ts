/**
 * A2A + AP2 example — procurement agent negotiates via A2A,
 * then triggers payment via AP2 once terms are agreed.
 */
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

async function procure(supplierEndpoint: string, sku: string, quantity: number) {
  // Step 1: Discover supplier agent via A2A Agent Card
  const agentCard = await bankee.a2a.discover(supplierEndpoint);
  console.log('Supplier agent:', agentCard.name, '| Skills:', agentCard.skills.map(s => s.id));

  // Step 2: Negotiate price and terms via A2A task
  const negotiation = await bankee.a2a.runTask(supplierEndpoint, {
    skill: 'negotiate_purchase',
    input: { sku, quantity, currency: 'GBP', maxBudget: quantity * 55 },
  });

  if (negotiation.status !== 'completed') {
    throw new Error(`Negotiation failed: ${negotiation.status}`);
  }

  const { agreedPrice, deliveryDays } = negotiation.output;
  console.log(`Agreed: £${agreedPrice / 100} per unit, ${deliveryDays} day delivery`);

  // Step 3: Pay via AP2 with human approval
  const payment = await bankee.agentic.createPayment({
    protocol: 'ap2',
    amount: agreedPrice * quantity,
    currency: 'GBP',
    approval: 'human-in-loop',
    agent: {
      id: 'procurement-agent-01',
      capabilities: ['initiate_payment', 'negotiate_price'],
    },
    metadata: {
      sku,
      quantity: String(quantity),
      negotiationId: negotiation.id,
      supplierEndpoint,
    },
  });

  console.log(`Payment ${payment.status}: ${payment.id}`);
  return { negotiation, payment };
}

procure('https://supplier.example.com', 'COMPONENT-XR7', 500).catch(console.error);

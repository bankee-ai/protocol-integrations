/**
 * AP2 example — AI shopping agent delegates payment to Bankee SDK.
 * User pre-authorises up to £100/day; agent shops autonomously within that limit.
 */
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({ apiKey: process.env.BANKEE_API_KEY! });

async function agentCheckout(merchantUrl: string, productId: string, amount: number) {
  // Step 1: Discover merchant's AP2 capabilities
  const capabilities = await bankee.ap2.discover(merchantUrl);
  console.log('Merchant supports:', capabilities.paymentMethods);

  // Step 2: Initiate AP2 payment with delegated authority
  const payment = await bankee.agentic.createPayment({
    protocol: 'ap2',
    amount,
    currency: 'GBP',
    approval: 'auto',   // within pre-authorised limits
    agent: {
      id: 'shopping-agent-01',
      capabilities: ['initiate_payment', 'browse_catalogue'],
    },
    metadata: { merchantUrl, productId },
  });

  console.log(`AP2 payment ${payment.status}: ${payment.id}`);
  return payment;
}

agentCheckout('https://shop.example.com', 'prod_abc123', 2999)
  .catch(console.error);

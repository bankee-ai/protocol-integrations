/**
 * ACP example — smartwatch initiates a purchase via Agentic Commerce Protocol.
 * Device agent completes checkout autonomously within pre-authorised limits.
 */
import { BankeeSDK } from '@bankee/sdk';

const bankee = new BankeeSDK({
  apiKey: process.env.BANKEE_API_KEY!,
  device: { type: 'watch', nfc: true, secureElement: true },
});

async function watchCheckout(merchantApi: string, sku: string) {
  // Fetch product via ACP cart feed
  const feed = await bankee.acp.getFeed(merchantApi);
  const product = feed.products.find(p => p.sku === sku);
  if (!product) throw new Error('Product not found');

  // Add to cart
  const cart = await bankee.acp.createCart(merchantApi, [
    { productId: product.id, quantity: 1 }
  ]);

  // Complete checkout with delegated payment via Bankee
  const order = await bankee.acp.checkout({
    merchant: merchantApi,
    cartId: cart.id,
    payment: {
      rail: 'wero',           // prefer Wero instant payment
      delegateLimit: 10000,   // £100.00 max
    },
    buyer: {
      agentId: `watch-${process.env.DEVICE_ID}`,
      approval: 'human-in-loop',
    },
  });

  console.log(`Order ${order.id} placed via ACP — status: ${order.status}`);
  return order;
}

watchCheckout('https://api.merchant.com/acp', 'WATCH-STRAP-BLK').catch(console.error);

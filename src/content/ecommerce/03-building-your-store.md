---
title: Building Your Store
minutes: 30
summary: Choose a platform, design a store and product pages that sell, take photos and write descriptions that convert and set policies and trust signals.
---

## Choosing a platform

Your store platform is the tool you use to build and run your shop. Options include:

- **Hosted store builders** (for example Shopify, Wix, Squarespace and Nigerian-focused builders): easiest, with templates, hosting, checkout and security included for a monthly fee.
- **Open-source or self-hosted** (such as WooCommerce on WordPress): flexible and cheaper at scale, but you manage hosting, updates and security.
- **Marketplace storefronts** (a shop page on a large marketplace): the least setup, with the marketplace's rules and fees.
- **Social commerce tools:** catalogues and shops on Instagram, Facebook and WhatsApp Business.

Choose with a checklist:

1. **Ease of use:** can you manage it without a developer?
2. **Cost:** subscription, transaction fees, app and theme costs, payment fees.
3. **Payments:** does it work with the payment methods your customers use in Nigeria?
4. **Delivery:** can it handle your shipping options and tracking?
5. **Mobile:** is it fast and easy on a phone? Most of your customers will use one.
6. **Growth:** can it handle more products and orders, and connect to marketing tools and analytics?
7. **Support and community:** help when something breaks.
8. **Control and data:** can you export your products and customer list?

For most beginners, a **hosted builder or a social shop** is the sensible start. Platform features and prices change, so compare current offers.

## Store design and product pages

Your store should be **clear, fast and trustworthy.**

**Store basics:**

- **Simple navigation:** a few clear categories, a search bar and an easy way to reach the cart.
- **A clean design** with your brand colours and logo, plenty of white space and readable text.
- **Mobile first,** with large buttons and short forms.
- **Fast pages:** compress images, avoid heavy features.
- **A clear home page:** what you sell, for whom, your best sellers and why to trust you.
- **Easy contact:** WhatsApp, phone, email and address.

**A product page is where the sale happens.** Include:

1. **A clear product name.**
2. **Good photos,** several angles, in use, and a zoom.
3. **A visible price** (and any discount shown clearly).
4. **Key benefits and details,** in short bullets (size, material, colours, weight, what is included).
5. **A description** answering likely questions.
6. **Variants** (size, colour) with stock status.
7. **Delivery information:** cost and time, so customers do not leave to find out.
8. **Return policy** summary.
9. **Reviews and ratings.**
10. **A prominent "Add to cart" or "Order" button.**
11. **Trust signals** such as secure payment icons and guarantees.

## Photos and descriptions that sell

Customers cannot touch your product, so **photos and words must do the work.**

**Photos:**

- Use **natural light** and a clean, plain background.
- Show **the whole product, details and the product in use** (a model, a hand, a room).
- Include a **size reference** (next to a common object, or on a person).
- Keep **colours accurate** and style consistent across the store.
- **Edit lightly** (crop, brighten) and compress for speed.
- A **short video** of the product in use builds trust.

**Descriptions:**

- Start with the **benefit** to the customer, then the features.
- Use **short paragraphs and bullets.**
- Be **specific and honest:** measurements, materials, care, what is included.
- Use **words your customers use,** and include the keywords people search for.
- Answer common questions (fit, sizing, delivery, care).
- End with a **clear call to action.**
- Never exaggerate, since returns and bad reviews follow.

Example: *"Kente Work Tote: fits a 15-inch laptop, a lunch box and your documents. Made from strong ankara fabric with a padded laptop pocket and a zip. 40 cm × 32 cm × 12 cm. Ships in 2 days within Lagos."*

## Policies and trust signals

Online customers worry: *Is this real? Will I get my order? What if it is wrong?* Reduce that fear with clear policies and proof.

**Policies to publish:**

- **Delivery policy:** areas, costs, times, how orders are tracked.
- **Return and refund policy:** what can be returned, within how many days, who pays, how refunds are made.
- **Payment policy:** accepted methods and security.
- **Privacy policy:** what data you collect and how you use and protect it (important under data protection law).
- **Terms and conditions:** the basic rules of buying from you.
- **Contact and about pages:** a real name, address, phone and the story behind the business.

**Trust signals:**

- **Reviews and testimonials,** with real photos.
- **Social proof:** number of customers, press mentions, followers.
- **Secure checkout** and recognised payment options.
- **Guarantees:** money-back, quality or delivery guarantees.
- **Fast, helpful responses** to questions.
- **Professional details:** consistent branding, correct spelling, working links.

Trust takes time. Be honest, deliver what you promise and ask happy customers to review.

## Try it

```task
{
  "id": "ecom-m03-t1",
  "prompt": "Write a **product page** for one of your products: the **title**, **three benefit bullets**, a **description of 40 to 90 words**, the **price**, **delivery information** and a **return summary**. Label each part.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Title: ...\nBullets: ...",
  "rules": [
    { "label": "Has a title", "pattern": "title" },
    { "label": "Has three bullets", "pattern": "(bullet|benefit)[\\s\\S]*(bullet|benefit)|(\\n\\s*[-•*].*){3}" },
    { "label": "Has a description", "pattern": "description" },
    { "label": "Has a price in naira", "pattern": "price[^\\n]*₦\\s?\\d" },
    { "label": "Has delivery information", "pattern": "delivery|ships" },
    { "label": "Has a return summary", "pattern": "return|refund" },
    { "label": "At least 70 words", "minWords": 70, "maxWords": 220 }
  ],
  "sample": "Title: Kente Work Tote, Ankara Laptop Bag\nBenefits:\n- Fits a 15-inch laptop, a lunch box and documents\n- Strong ankara fabric with a padded laptop pocket and zip\n- Easy to carry on a daily commute\nDescription: This tote is made for busy women who commute in Lagos. The ankara print stands out, the padded pocket protects your laptop and the strong straps carry up to 5 kg comfortably. It measures 40 cm by 32 cm by 12 cm and is made in Lagos by our own tailors.\nPrice: ₦12,000\nDelivery: ships in 2 days within Lagos for ₦1,500, and in 3 to 5 days nationwide\nReturns: return within 7 days if unused, with a full refund or exchange",
  "required": true
}
```

```task
{
  "id": "ecom-m03-t2",
  "prompt": "Choose a **platform** for your store and justify it in 50 to 100 words against at least four criteria (for example cost, ease, payments, mobile, growth).",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I will start with ...",
  "rules": [
    { "label": "Names a platform or option", "pattern": "shopify|wix|woocommerce|squarespace|instagram|whatsapp|marketplace|jumia|jiji|builder|social" },
    { "label": "Mentions cost", "pattern": "cost|price|fee|cheap|subscription|free" },
    { "label": "Mentions ease of use or mobile", "pattern": "easy|ease|simple|mobile|phone|no developer" },
    { "label": "Mentions payments or delivery", "pattern": "payment|paystack|flutterwave|delivery|checkout" },
    { "label": "Mentions growth or later changes", "pattern": "grow|scale|later|upgrade|export" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I will start with a hosted store builder, because it is easy to use without a developer and works well on a phone. The monthly subscription is predictable, and it supports Nigerian payment gateways and delivery options at checkout. I will also keep an Instagram catalogue for daily selling. Later, if orders grow, I can add apps and export my product list and customer data if I need to move to a different platform.",
  "required": true
}
```

```task
{
  "id": "ecom-m03-t3",
  "prompt": "List the **policies and trust signals** your store needs. Write at least eight lines, one per line, with a few words on what each says.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Delivery policy - ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Delivery policy", "pattern": "delivery" },
    { "label": "Return or refund policy", "pattern": "return|refund" },
    { "label": "Privacy policy", "pattern": "privacy" },
    { "label": "Contact details", "pattern": "contact|address|phone|whatsapp" },
    { "label": "Reviews or testimonials", "pattern": "review|testimonial" },
    { "label": "Secure payment or guarantee", "pattern": "secure|guarantee|payment" }
  ],
  "sample": "Delivery policy - areas, cost and time, with tracking\nReturn and refund policy - 7 days, unused, who pays and how refunds are made\nPayment policy - accepted methods and secure checkout\nPrivacy policy - what data we collect and how we protect it\nTerms and conditions - the basic rules of buying from us\nContact page - real address, phone and WhatsApp number\nAbout page - who we are and why we started\nCustomer reviews and testimonials with real photos\nMoney-back guarantee on every order",
  "required": false
}
```

Next lesson: payments and checkout.

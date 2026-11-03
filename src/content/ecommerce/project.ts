import type { ProjectDef } from "../types";

export const ECOM_PROJECT: ProjectDef = {
  id: "ecom-launch-store",
  courseId: "ecommerce-online-business",
  title: "Launch an online store",
  required: true,
  summary: "Plan and set up an online store or social shop: niche, products, unit economics, store pages, payments, delivery, policies and a 30-day launch.",
  brief: `Plan the launch of an online store (an own store, a marketplace shop or a social shop on Instagram and WhatsApp) for a real or realistic product line.

Use real prices and costs where you can, and state your assumptions. Submit a link to your plan or your live store (a shared document, PDF, folder or store link) and paste your **niche statement** and your **profit per order** below, with a short note on where to find each part.

Write for a mentor or a lender who will judge whether the business can make money: show the numbers behind every claim.`,
  tasks: [
    "Niche and products: a niche statement and three products with price, cost and supplier.",
    "Unit economics: the full cost of one order, contribution before marketing, break-even ROAS and profit per order.",
    "The store: model and platform, plus a complete product page for your best product.",
    "Payments and checkout: methods, fees, pay-on-delivery rules and a fraud checklist.",
    "Fulfilment: stock and reorder point, packaging, courier choice with costs and tracking plan.",
    "Policies: delivery, returns and refunds, privacy and a customer service routine.",
    "Marketing and a 30-day launch plan with targets, plus the metrics you will track.",
  ],
  datasets: [],
  rubric: [
    "The niche is specific and the products are backed by demand and a tested supplier.",
    "The unit economics include every cost and the profit per order is calculated correctly.",
    "The product page is clear, honest and complete, with price, delivery and returns information.",
    "Payments and fraud controls are realistic, including confirming payments before shipping.",
    "Fulfilment, courier choice and stock planning are practical and costed.",
    "Policies are clear and fair, and customer service is planned.",
    "The launch plan has measurable targets, and the metrics tracked are the right ones.",
  ],
};

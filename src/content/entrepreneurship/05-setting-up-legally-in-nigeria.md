---
title: Setting Up Legally in Nigeria
minutes: 25
summary: Choose a business structure, understand CAC registration, tax identification and taxes, licences, permits and contracts, and protect your name and brand.
---

> [!NOTE]
> Laws, fees, thresholds and procedures change, and the tax rules in particular have been under reform. This lesson explains the structure and the right questions. **Confirm current requirements with the Corporate Affairs Commission (CAC), the tax authority, the relevant regulator, or a qualified lawyer or accountant before you act.**

## Why register

An unregistered business can sell, but it is limited: many banks, customers and large companies will not deal with it, you cannot easily open a business account, apply for loans, grants or contracts, and you may be personally exposed. Registration makes the business **real, credible and easier to grow.**

## Business structures

| Structure | What it is | Pros | Cons |
| :-- | :-- | :-- | :-- |
| **Sole proprietorship (business name)** | One owner; the business is the owner in law | Simple, cheap, quick to start | Owner is personally liable for all debts |
| **Partnership (business name)** | Two or more owners share the business | Shared skills and capital | Partners are personally liable; disputes if not agreed in writing |
| **Private limited company (Ltd)** | A separate legal entity owned by shareholders | Separate from owners; limited liability; more credible; easier to raise funds | More paperwork, ongoing filings and compliance |
| **Public limited company (Plc)** | A company that can offer shares to the public | Can raise large capital | Heavy regulation; not for startups |
| **Incorporated trustees** | For non-profits, churches and associations | Suited to charitable and religious purposes | Not for making profit for owners |

Under the Companies and Allied Matters Act (CAMA) 2020, a company can now be formed by **a single person**, which makes a limited company possible for a solo founder. Choose by weighing **liability** (do you want your personal assets protected?), **cost and effort**, **credibility** (will customers and funders expect a company?) and **growth plans** (will you take on partners or investors?).

## CAC registration

In outline, to register:

1. **Choose a name** and check that it is available and acceptable (not misleading or already taken).
2. **Prepare your details:** the proprietor's or directors' full details, identification, address, business activities, and for a company the share capital and shareholders.
3. **Submit the application** through the CAC's online registration portal, pay the fees and upload the documents.
4. **Receive the certificate** and, for companies, the incorporation documents (certificate, memorandum and articles).
5. **After registration:** file annual returns as required, and update the CAC when details change.

Many people use an accredited agent (lawyer, chartered secretary or accountant) to handle it. If you do, check they are accredited and keep copies of everything.

## Tax identification and taxes

Once registered you should get a **Tax Identification Number (TIN)** from the tax authority. Taxes a small business commonly meets (rates and thresholds change, so check):

- **Company income tax** on a company's profits, with relief or exemption for small companies below certain turnover thresholds, and **personal income tax** on a sole proprietor's or partner's profits.
- **Value Added Tax (VAT)** at 7.5% on taxable goods and services. Businesses above a threshold must register, collect VAT from customers and pay it over, and file returns. Some items are exempt.
- **PAYE:** tax you deduct from employees' pay and remit.
- **Withholding tax** on certain payments.
- **Pension, NSITF and other employer contributions** that apply when you have employees, depending on staff numbers.
- **Local and state levies** (business premises, signage, and so on).

Keep **clear records of sales, costs and invoices,** file returns on time and ask an accountant to set up the basics. Penalties for late filing and unpaid tax add up quickly.

## Licences, permits and contracts

Besides registration, many businesses need approvals for what they do:

- **Food, drinks, drugs and cosmetics:** NAFDAC registration or approval.
- **Manufactured and imported goods:** standards approval by the Standards Organisation of Nigeria (SON) where applicable.
- **Health, education, finance, transport, telecoms, real estate and others:** a sector regulator may issue a licence.
- **Premises:** local government and state permits, fire and safety approvals.
- **Special rules:** for example, businesses in some sectors register with the body that monitors money-laundering controls.

Use **written contracts** for important dealings: with customers, suppliers, partners, employees and landlords. A good contract states who does what, the price and payment, delivery, quality, how problems are handled and how it ends. Do not rely only on handshakes, and have a lawyer review contracts that matter.

## Protecting your name and brand

- **Business name or company name:** registration protects the name against identical registrations at the CAC.
- **Trademark:** registering your name, logo or slogan at the Trademarks Registry gives you legal rights over its use in your category. It is separate from CAC registration.
- **Domain name and social media handles:** claim them early and keep the login details secure.
- **Copyright** arises automatically for original creative work (designs, writing, photos), but keep records of who created what and get **written agreements** with freelancers about who owns the work.
- **Confidentiality:** use agreements with staff and partners who learn your methods or customer lists.

## Try it

```task
{
  "id": "ent-m05-t1",
  "prompt": "Ada is starting a lunch delivery business alone, wants to protect her personal savings and plans to supply offices and later bring in an investor. Recommend a **business structure** in 50 to 110 words, with at least two reasons and one drawback.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I recommend ...",
  "rules": [
    { "label": "Recommends a limited company", "pattern": "limited company|\\bltd\\b|private limited|company" },
    { "label": "Mentions limited liability or protecting personal assets", "pattern": "liab|personal|protect|separate" },
    { "label": "Mentions credibility or investors or growth", "pattern": "credib|invest|grow|offices|trust|corporate" },
    { "label": "Mentions a drawback (cost, paperwork, filings, compliance)", "pattern": "cost|paperwork|filing|compliance|returns|more work|complex" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "I recommend a private limited company, which under CAMA 2020 can be formed by a single person. First, it is a separate legal entity with limited liability, so Ada's personal savings are protected if the business has debts. Second, offices and a future investor will find a registered company more credible and easier to deal with. The drawback is more paperwork and ongoing compliance, such as annual returns and tax filings, and higher set-up cost than a business name, but for her plans it is worth it.",
  "required": true
}
```

```task
{
  "id": "ent-m05-t2",
  "prompt": "Write a **set-up checklist** for registering your business, at least eight steps in order, one per line: name, structure, CAC, TIN, bank account, licences, contracts and brand protection.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "1. Choose and check the name ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Includes choosing a name or structure", "pattern": "name|structure" },
    { "label": "Includes CAC registration", "pattern": "cac|corporate affairs" },
    { "label": "Includes TIN or tax registration", "pattern": "tin|tax" },
    { "label": "Includes a business bank account", "pattern": "bank account|bank" },
    { "label": "Includes licences or permits (NAFDAC, SON, local)", "pattern": "licen[cs]e|permit|nafdac|son\\b|approval" },
    { "label": "Includes contracts or trademark", "pattern": "contract|trademark|brand|agreement" }
  ],
  "sample": "1. Decide the structure: a private limited company.\n2. Choose a name and check availability.\n3. Prepare identification and details of directors and shareholders.\n4. Register with the CAC through the online portal and pay the fees.\n5. Obtain the certificate of incorporation.\n6. Get a Tax Identification Number and register for the taxes that apply.\n7. Open a business bank account in the company name.\n8. Apply for NAFDAC and local government permits for food.\n9. Write contracts for customers and suppliers.\n10. Register the trademark and secure the domain and social handles.",
  "required": true
}
```

```task
{
  "id": "ent-m05-t3",
  "prompt": "Explain in 40 to 90 words **why a freelance designer should have a written agreement** about who owns the logo they create for you, and one thing the agreement should say.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "A written agreement matters because ...",
  "rules": [
    { "label": "Mentions ownership or copyright", "pattern": "owner|own|copyright|rights" },
    { "label": "Mentions the risk of disputes or later problems", "pattern": "dispute|later|misunderstand|claim|problem|clear" },
    { "label": "States what the agreement should say (transfer of rights, payment, scope)", "pattern": "transfer|assign|payment|scope|revision|deliver|exclusive|rights" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "A written agreement matters because copyright in a logo normally starts with the person who created it, not the person who paid, so without paperwork the designer could later claim ownership or reuse it, and you would have a dispute. The agreement should say that all rights in the finished logo are transferred to the business once it is paid for, and state the price, scope and number of revisions.",
  "required": false
}
```

Next lesson: marketing and selling.

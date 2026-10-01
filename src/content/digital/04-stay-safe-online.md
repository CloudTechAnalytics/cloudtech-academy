---
title: Stay Safe Online
minutes: 20
summary: Protect your accounts with strong passwords and two-step verification, spot phishing and scams, and manage your digital footprint.
---

## Strong passwords

Most accounts are hacked because of weak or reused passwords.

- Use a **long passphrase**: `Jollof-Rice-At-Eight-Tonight!` is long and easy to remember, and far stronger than `Tunde1234`.
- **Never reuse** the same password on important accounts. If one site is hacked, attackers try it everywhere.
- Use a **password manager** such as Bitwarden (free) or the one built into Chrome or your phone to remember them for you.

## Turn on two-step verification

**Two-step verification** (2SV or 2FA) asks for a code from your phone as well as your password. Even if someone steals your password, they can't get in.

Turn it on for your **email** first (email resets every other account), then WhatsApp, Instagram, LinkedIn and your bank app.

> [!WARNING]
> Never share a verification code (OTP) with anyone, even someone claiming to be from your bank, WhatsApp or school. No genuine organisation will ask for it.

## Spot phishing

**Phishing** is a fake message that tries to get your password, money or personal details. Warning signs:

- **Urgency or threats:** "Your account will be closed in 24 hours."
- **Too good to be true:** "You've won a scholarship! Pay ₦5,000 to process it."
- **Odd links:** hover over (or long-press) a link to see where it really goes. `unilag-portal.xyz` isn't your school.
- **Requests for codes, PINs or passwords.**
- **Messages from friends asking for money** out of the blue. Their account may be hacked. Call them to check.

When in doubt, don't click. Go to the website yourself or contact the organisation using details you already trust.

## Common scams targeting students

- Fake **scholarships** or **admission** offers that ask for a fee.
- **Job offers** that ask you to pay for training, a uniform or a "registration fee".
- **Investment** schemes promising big, fast returns.
- Fake **accommodation** listings that want a deposit before you've seen the room.

## Your digital footprint

Everything you post can be seen by future employers and scholarship panels.

- Search your own name on Google and see what comes up.
- Review old posts and privacy settings on each social account.
- Don't post your **home address**, **phone number**, **exam number** or **travel plans** publicly.

## Try it

This SMS arrived on a student's phone:

```text
UNILAG BURSARY: Dear student, your 2025/2026 school fees record shows an
unpaid balance and your portal will be DEACTIVATED in 24hrs. To avoid
suspension, verify your payment now at unilag-feesportal.xyz/verify and
enter the 6-digit code we will send to your phone.
```

```task
{
  "id": "digi-m04-t1",
  "prompt": "List the **warning signs** in this message, one per line, and finish with what the student should do instead.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "- ...\n- ...\nWhat to do: ...",
  "rules": [
    { "label": "Spots the urgency or threat", "pattern": "urgen|24 ?h|threat|deactivat|suspen|pressure|rush|time limit" },
    { "label": "Spots the fake web address", "pattern": "link|address|url|\\.xyz|domain|website|not (the|an) official" },
    { "label": "Spots the request for a code", "pattern": "code|otp|6-digit|verification" },
    { "label": "Says what to do instead (official portal, bursary office, don't click…)", "pattern": "official|bursary|portal yourself|go to the|contact|call|visit|don't click|do not click|ignore|delete|report|block" },
    { "label": "At least four lines", "minLines": 4 }
  ],
  "sample": "- Urgency and a threat: the portal will be \"deactivated in 24hrs\".\n- The link goes to unilag-feesportal.xyz, which isn't the university's official website.\n- It asks for a verification code: no genuine organisation needs your code.\n- It's vague: no amount, no reference number.\nWhat to do: don't click. Log in to the official school portal yourself, or contact the bursary office with details you already trust.",
  "required": true
}
```

Which of these web addresses is most likely genuine for logging in to Gmail?

- **A.** `gmail-secure-login.com`
- **B.** `accounts.google.com`
- **C.** `google.accounts-verify.net`
- **D.** `gmaiil.com`

```answer
{
  "id": "digi-m04-a1",
  "prompt": "Type the letter.",
  "answer": "B",
  "format": "text",
  "accept": ["b.", "(b)"],
  "explanation": "Read the part just before the first single slash: in accounts.google.com it ends in google.com. In C the real domain is accounts-verify.net, with \"google\" just a decoration in front of it.",
  "required": true
}
```

```task
{
  "id": "digi-m04-t2",
  "prompt": "Turn on **two-step verification** for your main email account. Write the steps you followed and which second step you chose (an app, SMS, a passkey…). **Don't write any password or code here.**",
  "minutes": 6,
  "rows": 5,
  "placeholder": "1. ...\n2. ...\nSecond step: ...",
  "rules": [
    { "label": "Mentions where you found it (settings, security, account…)", "pattern": "setting|security|account|manage" },
    { "label": "Names the second step you chose", "pattern": "authenticator|app|sms|text message|passkey|prompt|security key|backup code" },
    { "label": "At least three steps", "minLines": 3 },
    { "label": "No password or code typed in (no long digit runs)", "pattern": "\\b\\d{6,}\\b|password\\s*[:=]", "absent": true }
  ],
  "sample": "1. Opened myaccount.google.com and chose Security.\n2. Clicked 2-Step Verification and Get started.\n3. Signed in again and added my phone.\n4. Turned on Google prompts on my phone and saved my backup codes somewhere safe.\nSecond step: Google prompts on my phone, with backup codes as a spare.",
  "required": true
}
```

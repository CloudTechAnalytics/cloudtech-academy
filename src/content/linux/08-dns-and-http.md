---
title: DNS and HTTP
minutes: 25
summary: How a name like app.tallybook.example becomes an address (DNS records, TTLs and common mistakes), and how HTTP requests, methods and status codes work, read from a real zone file and access log.
---

## The problem

When a customer opens `app.tallybook.example`, two things happen before any Tallybook code runs: their phone asks **DNS** for the server's address, then sends an **HTTP** request to it. Both are configured in plain text files, and both are behind a large share of real outages: a wrong DNS record, a forgotten one, or a misunderstanding of what an HTTP status code means.

Tallybook's DNS zone is in `tallybook.example.zone`. Reading it carefully turns up a risk nobody had noticed.

## The concept

### DNS records

| Type | Maps | Example |
| :-- | :-- | :-- |
| **A** | a name to an IPv4 address | `app` → 196.43.12.10 |
| **CNAME** | a name to another name | `www` → tallybook.example. |
| **MX** | the domain to its mail servers, with a priority | `10 mx1.mailhost.example.` |
| **TXT** | text, used for email security (SPF, DMARC) and verification | `"v=spf1 ..."` |
| **NS** | the servers that answer for the domain | `ns1.dnshost.example.` |

**TTL** (time to live) says how long others may cache an answer, in seconds. Before moving a service, lower the TTL a day ahead so the change spreads quickly.

### Dangling records

A CNAME pointing to a cloud resource that has been deleted is **dangling**. If an attacker can create a resource with that name on the same cloud service, they control your subdomain. Remove records when you remove what they point to.

### HTTP

A request has a **method** (GET reads, POST creates or sends, PUT and PATCH update, DELETE removes), a path, and headers. The response has a **status code**:

| Class | Meaning | Examples |
| :-- | :-- | :-- |
| 2xx | success | 200 OK, 201 Created, 202 Accepted |
| 3xx | go elsewhere, or use your cached copy | 301 Moved, 304 Not Modified |
| 4xx | **the client's** mistake | 401 not logged in, 403 forbidden, 404 not found |
| 5xx | **the server's** failure | 502 bad gateway, 504 gateway timeout |


![The browser asks DNS for app.tallybook.example and gets an A record with an IP and a TTL; it then sends an HTTP request to the server. Below, the four classes of status code: 2xx success, 3xx redirect, 4xx client problem, 5xx server problem.](/images/courses/linux/dns-http.svg "From a name to a response, and what each class of status code means.")

## Example

The zone file, without its first two lines (the default TTL and the SOA record):

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/tallybook.example.zone
tail -n +3 tallybook.example.zone
```

```text
@        IN NS    ns1.dnshost.example.
@        IN NS    ns2.dnshost.example.
@        IN A     196.43.12.10
www      IN CNAME tallybook.example.
app      IN A     196.43.12.10
api      IN A     196.43.12.10
pay      IN CNAME app.tallybook.example.
status   IN CNAME tallybook.statuspage.example.
staging  IN CNAME staging-lb-2025.cloudhost.example.
@        IN MX    10 mx1.mailhost.example.
@        IN MX    20 mx2.mailhost.example.
@        IN TXT   "v=spf1 include:mailhost.example ~all"
_dmarc   IN TXT   "v=DMARC1; p=none; rua=mailto:dmarc@tallybook.example"
```

Count records by type:

```bash
%%bash
awk 'NR > 1 {print $3}' tallybook.example.zone | sort | uniq -c | sort -rn
```

```text
4 CNAME
      3 A
      2 TXT
      2 NS
      2 MX
      1 SOA
```

Two findings. `staging` is a CNAME to `staging-lb-2025.cloudhost.example`, a load balancer name from 2025; Tallybook's current staging load balancer is `staging-lb` (lesson 1 of the cloud course lists it). If the old one was deleted, this is a dangling record. And the DMARC record says `p=none`: emails pretending to come from tallybook.example are reported but not rejected, which matters for a company whose emails ask customers to pay invoices.

Now HTTP, from the access log: requests by status class and method.

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/access.log
awk '{print substr($9, 1, 1) "xx", substr($6, 2)}' access.log | sort | uniq -c | sort -k2,2 -k1,1nr
```

```text
4026 2xx GET
   2272 2xx POST
    362 3xx GET
    180 4xx GET
     37 4xx POST
    146 5xx GET
    118 5xx POST
```

(`substr($6, 2)` drops the quote before the method.) The 4xx responses are the scanner and failed logins: the clients' problem. The 5xx responses are all from the outage: Tallybook's problem. A live check of any website's headers looks like this (it needs the internet, so it isn't run here):

```bash norun
%%bash
curl -sI https://academy.cloudtechanalytics.com/
```

## Walkthrough

1. Run the cells. Which names point to the same address as the bare domain?
2. What would happen to `pay.tallybook.example` if the `app` record changed?
3. If you have internet access in Colab, run the `curl -sI` cell and identify the status code and two headers.
4. Write the DNS fixes (the task below).

## Practice

```answer
{
  "id": "lnx-08-p1",
  "prompt": "How many **CNAME** records are in the zone file?",
  "answer": 4,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/tallybook.example.zone', encoding='utf-8') if len(l.split()) > 2 and l.split()[2] == 'CNAME')",
  "hint": "The CNAME count in the second output.",
  "required": true
}
```

```answer
{
  "id": "lnx-08-p2",
  "prompt": "How many requests in the access log got a **4xx** status?",
  "answer": 217,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/access.log', encoding='utf-8') if l.split()[8].startswith('4'))",
  "hint": "Add up the 4xx lines in the last output.",
  "required": true
}
```

```task
{
  "id": "lnx-08-t1",
  "prompt": "Write the **DNS fixes** for tallybook.example, one per line starting with a dash: the **staging** record, the **DMARC** policy, and a **process** that stops dangling records happening again.",
  "minutes": 5,
  "rows": 4,
  "placeholder": "- staging: ...",
  "rules": [
    { "label": "At least three lines, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 3 },
    { "label": "Fixes staging (point to the current load balancer, or remove)", "pattern": "staging[^\\n]*(staging-lb\\b|current|remove|delete)" },
    { "label": "Strengthens DMARC (quarantine or reject)", "pattern": "quarantine|reject" },
    { "label": "A process (when deleting, review, check)", "pattern": "when[^\\n]*(delet|remov)|review|audit|check" }
  ],
  "sample": "- staging: change the CNAME to the current staging load balancer, staging-lb, or remove it if staging shouldn't be public.\n- DMARC: after checking the reports show only legitimate senders, move to p=quarantine, then p=reject, so forged invoice emails are blocked.\n- Process: whenever a cloud resource is deleted, remove any DNS record that points to it in the same change, and review the zone file every quarter for records pointing to resources that no longer exist.",
  "note": "Moving DMARC straight to reject can block your own legitimate emails; the reports tell you when it's safe.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A 504 Gateway Timeout means what?",
    "options": ["The client sent a bad request", "A server in the chain waited too long for the next one to answer", "The page moved", "The user isn't logged in"],
    "answer": 1,
    "explanation": "5xx codes are the server side's failures."
  },
  {
    "prompt": "Why lower a DNS record's TTL before moving a service?",
    "options": ["It's cheaper", "So caches expire quickly and the new address is picked up fast", "To hide the change", "TTL doesn't matter"],
    "answer": 1,
    "explanation": "High TTLs keep old answers cached for hours."
  },
  {
    "prompt": "What is a dangling DNS record?",
    "options": ["A record with a long TTL", "A record pointing to a resource that no longer exists, which someone else might claim", "An MX record", "A typo"],
    "answer": 1,
    "explanation": "Remove records when you remove what they point to."
  }
]
```

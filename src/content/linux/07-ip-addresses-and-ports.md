---
title: IP addresses and ports
minutes: 25
summary: Understand IP addresses, private and public ranges, CIDR blocks and ports, and audit a set of firewall rules to find which services are open to the whole internet.
---

## The problem

How could bots from all over the world try thousands of passwords on prod-web-01? Because the firewall let them. Somebody opened SSH to "anywhere" during a 2025 migration, labelled it temporary, and nobody closed it.

Firewall rules are short and easy to get wrong. Each one says: allow traffic of this protocol, to these ports, from these addresses. To audit them, you need to read addresses and ports fluently.

## The concept

**IP addresses**

An IPv4 address is four numbers from 0 to 255: `196.43.12.10`. Some ranges are **private**, used only inside networks and not reachable from the internet:

| Private range | CIDR |
| :-- | :-- |
| 10.0.0.0 to 10.255.255.255 | 10.0.0.0/8 |
| 172.16.0.0 to 172.31.255.255 | 172.16.0.0/12 |
| 192.168.0.0 to 192.168.255.255 | 192.168.0.0/16 |

**CIDR blocks**

`10.0.2.0/24` means "the first 24 bits are fixed": 10.0.2.0 to 10.0.2.255, 256 addresses. `/28` is 16 addresses; `/16` is 65,536. **`0.0.0.0/0` means every address on the internet.**

**Ports and protocols**

A server runs many services; a **port** number says which one. **TCP** is used for most connections; **UDP** for DNS lookups and streaming.

| Port | Service |
| :-- | :-- |
| 22 | SSH |
| 80, 443 | HTTP, HTTPS |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 3000, 8080 | common app and admin ports |
| 53 | DNS |

**The rule of thumb**

Only the public website (80 and 443) should be open to `0.0.0.0/0`. Everything else should come from known networks: the office, the VPN, other servers.

## Example

The firewall rules, in a CSV. Python's `ipaddress` module understands CIDR blocks:

```python
import ipaddress
import pandas as pd

rules = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/linux/firewall.csv")
inbound = rules[rules["direction"] == "inbound"].copy()
inbound["network"] = inbound["source"].map(ipaddress.ip_network)
inbound["addresses"] = inbound["network"].map(lambda n: n.num_addresses)
inbound["private"] = inbound["network"].map(lambda n: n.is_private)
inbound[["rule_id", "group", "port_from", "port_to", "source", "addresses", "private", "description"]]
```

```text
rule_id        group  port_from  port_to          source   addresses  private                              description
0      R01  web-servers        443      443       0.0.0.0/0  4294967296    False                      HTTPS from anywhere
1      R02  web-servers         80       80       0.0.0.0/0  4294967296    False  HTTP from anywhere (redirects to HTTPS)
2      R03  web-servers         22       22       0.0.0.0/0  4294967296    False  SSH - temporary, for the 2025 migration
3      R04  web-servers         22       22  102.89.34.0/28          16    False                      SSH from the office
4      R05  web-servers         22       22     10.0.2.0/24         256     True          SSH from the deployment network
5      R06  web-servers       3000     3001     10.0.1.0/24         256     True         App ports from the load balancer
6      R07  web-servers       9100     9100     10.0.3.0/24         256     True                               Monitoring
7      R08  admin-panel       8080     8080       0.0.0.0/0  4294967296    False                              Admin panel
8      R09     database       5432     5432     10.0.0.0/16       65536     True         Postgres from inside the network
9      R10     database       5432     5432       0.0.0.0/0  4294967296    False        Postgres - for the reporting tool
10     R11     database         22       22  102.89.34.0/28          16    False                      SSH from the office
12     R13        cache       6379     6379     10.0.0.0/16       65536     True            Redis from inside the network
```

Now the audit: inbound rules open to the whole internet on anything other than web ports.

```python
WEB_PORTS = {80, 443}
open_to_all = inbound[(inbound["source"] == "0.0.0.0/0") & ~inbound["port_from"].isin(WEB_PORTS)]
print(open_to_all[["rule_id", "group", "port_from", "description"]].to_string(index=False))
```

```text
rule_id       group  port_from                             description
    R03 web-servers         22 SSH - temporary, for the 2025 migration
    R08 admin-panel       8080                             Admin panel
    R10    database       5432       Postgres - for the reporting tool
```

Three problems:

- **R03**, SSH from anywhere: how the brute-force attacks in lesson 6 reached the server. The office (R04) and deployment network (R05) rules already cover legitimate use.
- **R08**, the admin panel open to the world: anyone can try to log in to it.
- **R10**, the database open to the world "for the reporting tool": the database's login page is now facing every bot on the internet. The reporting tool should connect from a known address or through the private network.

Is the office address really inside its rule? Check an address against a block:

```python
office = ipaddress.ip_network("102.89.34.0/28")
for ip in ["102.89.34.5", "102.89.34.20", "194.26.29.120"]:
    print(ip, ipaddress.ip_address(ip) in office)
```

```text
102.89.34.5 True
102.89.34.20 False
194.26.29.120 False
```

## Walkthrough

1. Run the cells. How many addresses does each private source block contain?
2. Which rule allows the load balancer (10.0.1.5) to reach the app? Check with `ipaddress`.
3. R12 allows all outbound traffic. How did that help the intruder? (Hint: a miner needs to send its results somewhere.)
4. Write the corrected rules (the task below).

## Practice

```answer
{
  "id": "lnx-07-p1",
  "prompt": "How many **inbound** rules are open to `0.0.0.0/0` on ports **other than** 80 and 443?",
  "answer": 3,
  "format": "number",
  "pyVerify": "len(open_to_all)",
  "hint": "Count the rows of the second output.",
  "required": true
}
```

```answer
{
  "id": "lnx-07-p2",
  "prompt": "How many addresses does a **/28** block contain?",
  "answer": 16,
  "format": "number",
  "pyVerify": "ipaddress.ip_network('102.89.34.0/28').num_addresses",
  "hint": "2 to the power of (32 − 28).",
  "required": true
}
```

```task
{
  "id": "lnx-07-t1",
  "prompt": "Write the **firewall changes**, one per line starting with the rule ID: what to do with **R03**, **R08**, **R10** and **R12**, each with the new source (or removal) and why.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "R03: delete ...",
  "rules": [
    { "label": "Lines for R03, R08, R10 and R12", "pattern": "^\\s*[-*]?\\s*R(03|08|10|12)\\b", "min": 4 },
    { "label": "R03 removed (SSH already allowed from the office and deployment network)", "pattern": "R03[^\\n]*(delete|remove)" },
    { "label": "R08 restricted to a known network (office, VPN, a CIDR)", "pattern": "R08[^\\n]*(office|vpn|\\d+\\.\\d+\\.\\d+\\.\\d+/\\d+|delete|remove)" },
    { "label": "R10 restricted (private network, a known address)", "pattern": "R10[^\\n]*(10\\.0\\.|private|\\d+\\.\\d+\\.\\d+\\.\\d+/32|delete|remove)" },
    { "label": "R12 limited (only needed destinations or ports)", "pattern": "R12[^\\n]*(only|limit|restrict|443|53)" },
    { "label": "No new 0.0.0.0/0 rule for SSH, admin or database", "pattern": "(22|8080|5432)[^\\n]*0\\.0\\.0\\.0/0", "absent": true }
  ],
  "sample": "R03: delete it; SSH is already allowed from the office (R04) and the deployment network (R05).\nR08: change the source to the office block 102.89.34.0/28, or put the admin panel behind the VPN.\nR10: delete it; give the reporting tool a fixed address and allow only that /32, or connect it through the private network.\nR12: allow outbound only to the ports the app needs (443 for APIs and updates, 53 for DNS), so malware can't freely connect out.",
  "note": "Writing the reason next to each change matters: R03's 'temporary' description shows how a rule without an owner or end date outlives its purpose.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does `0.0.0.0/0` mean as a firewall source?",
    "options": ["No addresses", "Every address on the internet", "The local machine", "A private network"],
    "answer": 1,
    "explanation": "Only public web ports should be open to it."
  },
  {
    "prompt": "Which of these is a private address?",
    "options": ["196.43.12.10", "10.0.2.15", "41.58.20.7", "185.220.101.47"],
    "answer": 1,
    "explanation": "10.0.0.0/8 is private."
  },
  {
    "prompt": "Which port does PostgreSQL use by default?",
    "options": ["22", "443", "5432", "53"],
    "answer": 2,
    "explanation": "And it should never be open to the internet."
  }
]
```

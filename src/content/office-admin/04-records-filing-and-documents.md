---
title: Records, Filing and Documents
minutes: 25
summary: Organise paper and digital filing, name and arrange files, protect confidential records and archive and dispose of documents properly.
---

## Paper and digital filing

A good filing system lets you **find any document in under a minute,** protects important information and meets legal and audit requirements. A bad one wastes hours, loses papers and creates risk.

**Principles:**

- **One place for each thing.** Everyone should know where a document goes and where to find it.
- **Simple and logical.** If a new colleague cannot understand the system quickly, it is too complicated.
- **Consistent.** Apply the same rules to everything.
- **File promptly,** not in a pile "for later."
- **Keep originals safe,** and work from copies where possible.
- **Remove duplicates** and out-of-date versions.

**Common ways to arrange files:**

| Method | How | Good for |
| :-- | :-- | :-- |
| **Alphabetical** | By name (A to Z) | Customers, suppliers, staff |
| **Numerical** | By number (invoice or case number) | Invoices, orders, cases |
| **Chronological** | By date | Correspondence, bank statements |
| **Subject / category** | By topic (Finance, HR, Legal, Projects) | General office files |
| **Geographical** | By place | Branches, regions |

A filing system often combines them: for example, main folders by subject (Finance, HR, Clients), then sub-folders by name, then documents by date.

**Paper filing tools:** lever-arch and ring binders, suspension files, labelled folders, dividers and a lockable cabinet. Label clearly, and leave space to grow. Keep active files within reach, and send old ones to archive.

**Digital filing:** use a clear **folder structure** on a shared drive or cloud storage, with access permissions. Mirror the paper structure where you have both. **Scan** important paper documents at good quality, name them properly, and store them in the right folder, so you can retire the paper where the law allows.

## Naming and organising files

**File names** are the key to finding documents. A good **naming convention** is consistent, clear and sortable.

Rules:

- **Start with the date in a sortable format:** year-month-day, for example `2026-03-12`.
- **Include the main identifiers:** client or project, document type, short description.
- **Add a version number** for drafts: `v1`, `v2`, `FINAL`.
- **Keep names short but meaningful,** avoid special characters, and use hyphens or underscores instead of spaces.
- **Be consistent across the team.**

Examples:

- `2026-03-12_BrightSchools_Invoice_0147.pdf`
- `2026-03-05_BoardMeeting_Minutes_v2.docx`
- `2026-02_Budget_Marketing_FINAL.xlsx`

Poor names: `new doc.docx`, `letter final final 2.docx`, `scan0001.pdf`.

**Folder structure example:**
```
Company Admin
  01 Finance
    2026
      Invoices
      Bank statements
  02 HR
    Contracts
    Leave records
  03 Clients
    Bright Schools
      Contracts
      Correspondence
  04 Projects
  05 Templates
  99 Archive
```

Numbering the top folders keeps them in order. **Document control** for important documents includes a version history (who changed what and when), an owner for each document and a clear rule about which version is current.

**Housekeeping:** at regular intervals (weekly or monthly) clear the desktop and downloads folder, file stray documents, delete duplicates and back up.

## Confidential and sensitive records

Some records need extra protection: personnel files, salaries, medical information, contracts, legal matters, financial data, customer personal data, passwords and strategy.

**Physical security:**

- Keep in a **locked cabinet or room,** with controlled keys.
- **Clear desk:** do not leave sensitive papers out when you step away.
- **Shred** confidential waste; do not just bin it.
- **Sign in and out** files taken from storage.
- **Limit who can enter** records areas.

**Digital security:**

- **Strong, unique passwords,** and two-step verification where possible.
- **Access permissions:** only the people who need a file can open it.
- **Lock your screen** when away.
- **Encrypt or password-protect** sensitive files, especially when sending them.
- **Be careful with email and USB drives;** check recipients and avoid personal storage for company data.
- **Back up regularly:** a good rule is **3-2-1** (three copies of data, on two different types of storage, with one copy off-site or in the cloud).
- **Keep software updated** and be alert to phishing emails.

**Data protection:** under the Nigeria Data Protection Act 2023, personal data must be collected for a clear purpose, kept accurate and secure, used only as needed and not kept longer than necessary. Follow your organisation's data protection policy, and report any suspected data breach to the person responsible immediately.

## Archiving and retention

You cannot keep everything forever, and you cannot throw everything away. **Retention** rules say **how long** to keep each type of record, and **archiving** moves rarely used records to safe, organised storage.

A **retention schedule** lists record types, how long to keep them and what to do afterwards. Examples (illustrative only; the periods depend on law, regulators and your organisation's policy, so **check the current requirements and take advice**):

| Record type | Typical approach |
| :-- | :-- |
| Tax and accounting records | Keep for the period required by tax and company law (often several years) |
| Employee records | Keep during employment and for a set period afterwards |
| Contracts | Keep for the life of the contract plus a set period |
| Meeting minutes and board papers | Often kept permanently |
| Routine correspondence | Short period, then dispose of |
| Job applications (unsuccessful) | Short period, then delete |
| Health and safety records | As required by the regulations |

**Archiving steps:** select records that are no longer active, list them (an index with contents, dates, box number and location), pack them in labelled boxes, store them safely (dry, secure, protected from fire and pests), and record the planned destruction date.

**Disposal:** when the retention period ends and nothing prevents it (no legal hold or dispute), **destroy securely:** shred paper, permanently delete digital files (including backups where practical), and keep a **record of destruction.** Never dispose of confidential documents in ordinary waste.

## Try it

```task
{
  "id": "poa-m04-t1",
  "prompt": "Rename these badly named files using a clear convention (date, name, type, version). Write **six new file names**, one per line: (1) a March 2026 invoice number 0147 for Bright Schools; (2) draft 2 of the March board meeting minutes; (3) a final marketing budget for February 2026; (4) a signed contract with ABC Ltd, 10 January 2026; (5) a staff leave form for Tola Ade, March 2026; (6) a scan of the office lease.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "2026-03_BrightSchools_Invoice_0147.pdf",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "Each line starts with a date (year first)", "pattern": "^\\s*2026|^\\s*\\d{4}", "min": 5 },
    { "label": "Each line has an extension", "pattern": "\\.(pdf|docx|xlsx|doc|jpg|png)", "min": 6 },
    { "label": "Uses underscores or hyphens, no spaces in the name", "pattern": "_", "min": 6 },
    { "label": "Includes a version or FINAL", "pattern": "v2|final|v1" }
  ],
  "sample": "2026-03_BrightSchools_Invoice_0147.pdf\n2026-03_BoardMeeting_Minutes_v2.docx\n2026-02_Marketing_Budget_FINAL.xlsx\n2026-01-10_ABC_Contract_Signed.pdf\n2026-03_Leave_Form_TolaAde.pdf\n2026_Office_Lease_Scan.pdf",
  "required": true
}
```

```task
{
  "id": "poa-m04-t2",
  "prompt": "Design a **folder structure** for a small company's shared drive: at least **ten folders and sub-folders**, one per line, using numbering and indentation (spaces) to show the hierarchy. Include an Archive and a Templates folder.",
  "minutes": 10,
  "rows": 14,
  "placeholder": "01 Finance\n  2026\n    Invoices",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Includes finance and HR", "pattern": "finance[\\s\\S]*hr|hr[\\s\\S]*finance" },
    { "label": "Includes clients or projects", "pattern": "client|project" },
    { "label": "Includes Archive", "pattern": "archive" },
    { "label": "Includes Templates", "pattern": "template" },
    { "label": "Shows hierarchy with indentation", "pattern": "\\n\\s{2,}\\S" }
  ],
  "sample": "01 Finance\n  2026\n    Invoices\n    Bank statements\n02 HR\n  Contracts\n  Leave records\n03 Clients\n  Bright Schools\n    Contracts\n    Correspondence\n04 Projects\n05 Templates\n99 Archive",
  "required": true
}
```

```task
{
  "id": "poa-m04-t3",
  "prompt": "Write **six security rules** for confidential records in your office, one per line, covering paper, computer, email, passwords, backup and disposal. Add one line saying that retention periods must be checked against current law.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Keep personnel files in a locked cabinet ...",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "Locked storage or clear desk", "pattern": "lock|cabinet|clear desk|key" },
    { "label": "Computer or screen lock", "pattern": "screen|computer|lock your|log off" },
    { "label": "Passwords", "pattern": "password" },
    { "label": "Backup", "pattern": "back ?up|backup|3-2-1" },
    { "label": "Shredding or secure disposal", "pattern": "shred|dispose|destroy|delete" },
    { "label": "Check retention against law", "pattern": "retention|law|check|advice|requirement" }
  ],
  "sample": "Keep personnel and salary files in a locked cabinet and sign out any file taken.\nKeep a clear desk and put sensitive papers away when I leave.\nLock my computer screen whenever I step away.\nUse strong, unique passwords and never share them.\nPassword-protect sensitive files and check the recipient before sending email.\nBack up data using the 3-2-1 rule, with one copy off-site.\nShred confidential paper and securely delete digital files at the end of the retention period.\nCheck retention periods against current law and company policy before disposal.",
  "required": false
}
```

Next lesson: office software.

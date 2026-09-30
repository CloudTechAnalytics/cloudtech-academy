---
title: Publishing reports
minutes: 30
summary: Publish to the Power BI Service, share safely, keep data fresh with scheduled refresh, and show your work in a portfolio.
---

## The problem

The report works on your laptop. Now the managing director, the regional managers and the sales reps need it, with fresh numbers every morning, without anyone emailing `.pbix` files. And some of them should only see their own region.

## The concept

**Publishing.** In Desktop, **Home → Publish** uploads the report and its data (the *semantic model*, formerly called a dataset) to a **workspace** in the Power BI Service (app.powerbi.com). You need to sign in with a **work or school account**.

**Workspaces and licences**

| | What you can do |
| :-- | :-- |
| **Free licence** | Publish to *My workspace* and view your own content. You can't share with others |
| **Pro licence** (paid, per user) | Create shared workspaces, share reports, and view content others share with you. Both the sharer and the viewer need Pro |
| **Premium Per User / Premium or Fabric capacity** | Larger models, more refreshes; with a large enough capacity, free users can view shared content |

Check your organisation's licences before promising a rollout.

**Ways to share**

- **Workspace access**: colleagues who build and maintain reports.
- **Share** a single report with named people.
- **Apps**: package a workspace's reports into a tidy app for a wider audience (the recommended way to distribute).
- **Export**: PDF or PowerPoint snapshots (File → Export) for board packs.
- **Publish to web**: creates a **public** link anyone on the internet can open, with no sign-in. **Never** use it for company data; your admin may have switched it off, and that's a good thing.

**Keeping data fresh: scheduled refresh.** In the Service, the semantic model's settings let you schedule refreshes (up to 8 a day on Pro). Data from files on your own computer or company servers needs an **on-premises data gateway**; cloud sources such as SharePoint or OneDrive files usually don't.

**Row-level security (RLS).** In Desktop, **Modeling → Manage roles** lets you define rules such as `[region] = "Lagos"`. Assign people to roles in the Service, and each sees only their rows. This is how one report serves every regional manager.

## Example

Kolanut's rollout plan:

1. Move the CSVs to a SharePoint folder so refresh works without a gateway.
2. Publish to a workspace called *Sales Analytics* (analysts have access).
3. Add RLS roles for each region; map regional managers to their role.
4. Schedule refresh daily at 6:00.
5. Publish an **app** called *Kolanut Sales* for managers and reps.
6. Export page 1 to PDF for the monthly board pack.

## Walkthrough

**If you have a work or school account:**

1. **Home → Publish** → choose *My workspace*.
2. Open app.powerbi.com, find the report, and explore it in the browser.
3. Open the semantic model's settings and look at the **Scheduled refresh** options (it will explain that local CSVs need a gateway).

**For your portfolio (no work account needed):**

1. Save the `.pbix`. It contains everything, so reviewers can open it in Desktop.
2. Take clean screenshots of each page (File → Export → Export to PDF also works offline).
3. Write a one-page README: the business question, the data, the model (screenshot of Model view), the key measures, and the findings.
4. Put the `.pbix`, PDF and README in a GitHub repository or a shared drive folder.

## Practice

```answer
{
  "id": "pbi-13-p1",
  "prompt": "Which sharing option creates a **public** link that anyone on the internet can open, and must never be used for company data? (Three words.)",
  "answer": "Publish to web",
  "accept": ["publish to the web"],
  "format": "text",
  "required": true,
  "hint": "It's under File → Embed report, and it makes the report public."
}
```

```answer
{
  "id": "pbi-13-p2",
  "prompt": "Which Power BI feature makes each regional manager see only their own region's rows in the same report? (Give the three-word name.)",
  "answer": "Row-level security",
  "accept": ["row level security", "rls", "Row-level-security"],
  "format": "text",
  "required": true,
  "hint": "It's often shortened to RLS, and it's set up with roles in Modeling → Manage roles."
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You have a free licence. What can you do after publishing?",
    "options": ["Share the report with your whole team", "View it yourself in My workspace", "Publish an app for managers", "Schedule refresh for other users' reports"],
    "answer": 1,
    "explanation": "Sharing needs Pro (or capacity-based licensing)."
  },
  {
    "prompt": "Your report uses CSV files on your laptop. What is needed for scheduled refresh in the Service?",
    "options": ["Nothing", "An on-premises data gateway, or moving the files to a cloud location like SharePoint", "Publish to web", "A mobile layout"],
    "answer": 1,
    "explanation": "The Service can't reach your laptop without a gateway."
  },
  {
    "prompt": "What's the recommended way to distribute a set of reports to a wide internal audience?",
    "options": ["Email .pbix files", "A Power BI app", "Publish to web", "Screenshots on WhatsApp"],
    "answer": 1,
    "explanation": "Apps give a tidy, permission-controlled experience."
  }
]
```

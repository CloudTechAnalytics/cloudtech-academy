import type { ProjectDef } from "../types";

export const LNX_PROJECT: ProjectDef = {
  id: "lnx-prod-web-01-investigation",
  courseId: "linux-networking-basics",
  title: "What happened on prod-web-01",
  required: true,
  summary: "A full investigation of a web server from its logs and command output: a timeline of the outage and the break-in, findings with evidence and severity, fixes with owners, and scripts that would have caught each problem.",
  brief: `Tallybook's CTO wants a written investigation of prod-web-01, to share with investors and an enterprise customer. Every claim must be backed by a command and its output.

Work in a Google Colab notebook, using %%bash cells. Download the server's files with:

\`\`\`bash
%%bash
for f in access.log auth.log ps.txt df.txt du.txt ls.txt firewall.csv tallybook.example.zone; do
  curl -sO https://academy.cloudtechanalytics.com/datasets/linux/$f
done
\`\`\`

Submit a link to your notebook (shared so anyone with the link can view it), and paste your **timeline**, your **findings table** and your **executive summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Timeline: every significant event with its time, from the first attack to the end of the outage, built with commands from both logs.",
    "The outage: when it started and ended, errors by type and path, and response times during and outside it.",
    "The break-in: failed attempts by address, the successful login, what the intruder tried and how the miner keeps running.",
    "The server's state: the miner's CPU use, disk space and what's filling it, and the files with unsafe permissions.",
    "The network: firewall rules open to the internet, the DNS records that need fixing, and the changes for each.",
    "Detection: a script for each problem (errors, password logins, unknown busy processes, disk space) and the cron lines that run them.",
    "An executive summary that keeps facts and conclusions distinct, with fixes done and still to do.",
  ],
  datasets: [],
  rubric: [
    "Every finding is supported by a command and its output that anyone can rerun.",
    "The timeline is complete, ordered and drawn from both logs.",
    "Facts and conclusions are clearly distinguished.",
    "Severity is judged sensibly, with the break-in treated as a compromise of the whole server.",
    "Fixes are specific (exact permissions, firewall sources, SSH settings) and have owners.",
    "Detection scripts work on the files and exit with a meaningful code.",
    "The summary is clear to a non-technical reader.",
  ],
};

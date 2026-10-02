import type { AssessmentDef } from "../types";

/**
 * Final assessment for Linux and Networking Basics. Scenario questions on commands, text
 * processing, permissions, processes, SSH, addresses, ports, DNS, HTTP and scripting.
 */
export const LNX_ASSESSMENT: AssessmentDef = {
  id: "linux-networking-basics-final",
  courseId: "linux-networking-basics",
  title: "Linux and Networking Basics: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "lnxq01",
      prompt: "Which command shows the last 20 lines of a log?",
      options: ["head -n 20 app.log", "tail -n 20 app.log", "wc -l app.log", "ls -l app.log"],
      answer: 1,
      explanation: "Logs grow at the end.",
    },
    {
      id: "lnxq02",
      prompt: "What does `cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -n 5` show?",
      options: ["The first 5 lines", "The 5 most frequent values of the first field, with counts", "5 random addresses", "The file size"],
      answer: 1,
      explanation: "Count and rank: one of the most useful pipelines.",
    },
    {
      id: "lnxq03",
      prompt: "Which awk command prints only lines whose 9th field is 500 or more?",
      options: ["awk '{print $9}' file", "awk '$9 >= 500' file", "awk 'NR >= 500' file", "awk '$500' file"],
      answer: 1,
      explanation: "A condition with no action prints matching lines.",
    },
    {
      id: "lnxq04",
      prompt: "A private SSH key has permissions -rw-r--r--. What should they be?",
      options: ["644", "600", "777", "755"],
      answer: 1,
      explanation: "Owner read and write only.",
    },
    {
      id: "lnxq05",
      prompt: "A script run by cron every night is -rwxrwxrwx. What's the risk?",
      options: ["None", "Anyone on the server can change it, and their code then runs automatically", "It runs too often", "It can't be read"],
      answer: 1,
      explanation: "Writable plus automatic execution is an open door.",
    },
    {
      id: "lnxq06",
      prompt: "/var is at 97% and most of it is nginx logs. What's the lasting fix?",
      options: ["Delete all logs now", "Configure log rotation to compress and delete old logs", "Buy a bigger disk every month", "Stop nginx"],
      answer: 1,
      explanation: "Rotation keeps logs bounded.",
    },
    {
      id: "lnxq07",
      prompt: "auth.log shows 312 failed passwords for 'backup' from one address, then 'Accepted password for backup' from it. What happened?",
      options: ["A normal login", "A successful brute-force attack", "A failed attack", "A cron job"],
      answer: 1,
      explanation: "Many failures then a success is a guessed password.",
    },
    {
      id: "lnxq08",
      prompt: "Which SSH setting prevents password-guessing attacks?",
      options: ["PermitRootLogin yes", "PasswordAuthentication no, so only keys are accepted", "Port 22", "UseDNS yes"],
      answer: 1,
      explanation: "Keys can't be brute-forced.",
    },
    {
      id: "lnxq09",
      prompt: "A firewall rule allows port 5432 from 0.0.0.0/0. What does that mean?",
      options: ["The database is closed", "The database port is reachable from every address on the internet", "Only the office can connect", "It blocks the database"],
      answer: 1,
      explanation: "Only web ports should face the whole internet.",
    },
    {
      id: "lnxq10",
      prompt: "How many addresses are in 10.0.2.0/24?",
      options: ["24", "256", "65,536", "16"],
      answer: 1,
      explanation: "2^(32−24) = 256.",
    },
    {
      id: "lnxq11",
      prompt: "A CNAME points to a cloud load balancer that was deleted. What's the risk?",
      options: ["None", "Someone could create a resource with that name and take over the subdomain", "Email stops", "The TTL expires"],
      answer: 1,
      explanation: "Remove records when you remove what they point to.",
    },
    {
      id: "lnxq12",
      prompt: "A check script finds a problem. Why should it `exit 1`?",
      options: ["To delete the log", "So cron or a monitoring tool can see the failure and alert", "Bash requires it", "To save memory"],
      answer: 1,
      explanation: "Exit codes report success or failure.",
    },
  ],
};

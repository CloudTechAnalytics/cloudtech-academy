import type { ProjectDef } from "../types";

export const IAC_PROJECT: ProjectDef = {
  id: "iac-tallybook-review",
  courseId: "terraform-infrastructure-as-code",
  title: "Tallybook's infrastructure review",
  required: true,
  summary: "A review of a company's Terraform estate and six pending pull requests: coverage, secrets in state, plan risks, policy checks, drift, and the pipeline that makes Terraform the only way infrastructure changes.",
  brief: `Tallybook's CTO wants to adopt infrastructure as code properly. Review its Terraform state, its two environments and the six pull requests waiting, and set the rules from now on.

Work in Google Colab. The files are at https://academy.cloudtechanalytics.com/datasets/terraform/ (terraform.tfstate, staging.tfvars.json, production.tfvars.json and plan-pr-101 to plan-pr-106), with the cloud inventory at https://academy.cloudtechanalytics.com/datasets/cloud/resources.csv and the firewall rules at https://academy.cloudtechanalytics.com/datasets/linux/firewall.csv. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **PR scorecard**, your **policy list** and your **executive summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Coverage: what Terraform manages compared with the cloud inventory, and what the unmanaged resources cost.",
    "Environments: staging and production compared, with costs and the differences that matter.",
    "State: the secrets in the state file, and the steps to secure it.",
    "Pull requests: a summary of every plan, the dangerous changes, and a review comment with a specific fix for each risky PR.",
    "Policies: policy functions run on every plan, with a decision for each PR.",
    "Drift: attribute drift and unmanaged firewall rules, with a decision for each.",
    "The way of working: modules, the pipeline and the drift policy, ending with an executive summary and first actions.",
  ],
  datasets: [],
  rubric: [
    "Every finding is backed by code run on the state, plans or inventory.",
    "Plans are read for what they do, not what their titles say, including hidden attribute changes.",
    "Fixes are specific and correct (moved blocks, lifecycle rules, split PRs, restricted sources).",
    "Policies are implemented as working checks with sensible block and warn levels.",
    "Secrets and state handling are treated as a security risk, with rotation first.",
    "Drift is detected and each case gets a clear decision.",
    "The summary leads with decisions and is clear to a non-specialist.",
  ],
};

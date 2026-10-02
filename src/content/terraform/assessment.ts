import type { AssessmentDef } from "../types";

/**
 * Final assessment for Infrastructure as Code with Terraform. Scenario questions on state,
 * plans, dangerous changes, policies, drift, modules and the pipeline.
 */
export const IAC_ASSESSMENT: AssessmentDef = {
  id: "terraform-infrastructure-as-code-final",
  courseId: "terraform-infrastructure-as-code",
  title: "Infrastructure as Code with Terraform: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "iacq01",
      prompt: "A server was created by hand in the console. What does Terraform know about it?",
      options: ["Everything", "Nothing: it isn't in the state", "Only its cost", "Only its name"],
      answer: 1,
      explanation: "Terraform only sees what's in its state.",
    },
    {
      id: "iacq02",
      prompt: "What happens when you run `terraform plan`?",
      options: ["Infrastructure changes", "Terraform shows what it would change, without changing anything", "State is deleted", "Providers are removed"],
      answer: 1,
      explanation: "Only apply changes things.",
    },
    {
      id: "iacq03",
      prompt: "Staging and production use the same Terraform code. Where do their differences live?",
      options: ["In separate code copies", "In each environment's variable values", "In the state only", "In the provider"],
      answer: 1,
      explanation: "Same code, different variables.",
    },
    {
      id: "iacq04",
      prompt: "An output is marked sensitive. Is the value safe in the state file?",
      options: ["Yes", "No: sensitive hides it in printed output, but the file stores it in plain text", "Only if encrypted by Terraform", "It isn't stored"],
      answer: 1,
      explanation: "Treat state as a secret.",
    },
    {
      id: "iacq05",
      prompt: "Why use a remote backend with locking?",
      options: ["To make plans faster", "So everyone shares one safe copy of state and two applies can't run at once", "To avoid providers", "It's required for modules"],
      answer: 1,
      explanation: "Shared, locked and protected state.",
    },
    {
      id: "iacq06",
      prompt: "A plan shows `-/+` for the production database. What will happen?",
      options: ["An in-place update", "The database will be destroyed and a new, empty one created", "A backup", "Nothing"],
      answer: 1,
      explanation: "Replacement of a stateful resource means data loss.",
    },
    {
      id: "iacq07",
      prompt: "A PR renames `aws_db_instance.prod` to `aws_db_instance.main`. How do you avoid destroying it?",
      options: ["Run apply twice", "Add a moved block from the old address to the new one", "Delete the state", "Use count"],
      answer: 1,
      explanation: "moved renames in state.",
    },
    {
      id: "iacq08",
      prompt: "What does `lifecycle { prevent_destroy = true }` do?",
      options: ["Backs up the resource", "Makes Terraform refuse any plan that would destroy it", "Hides it", "Encrypts it"],
      answer: 1,
      explanation: "A guard against accidental deletion.",
    },
    {
      id: "iacq09",
      prompt: "A PR titled 'enable multi-AZ' also changes engine_version from 15.4 to 16.3. What should the reviewer do?",
      options: ["Approve: it's an update", "Ask for the upgrade to be split out and scheduled separately", "Reject all updates", "Ignore it"],
      answer: 1,
      explanation: "Every changed attribute needs a reason.",
    },
    {
      id: "iacq10",
      prompt: "Which should a policy check block automatically?",
      options: ["Adding a tag", "Ingress from 0.0.0.0/0 on port 5432", "Changing an instance type", "A long plan"],
      answer: 1,
      explanation: "Opening a database to the internet is never routine.",
    },
    {
      id: "iacq11",
      prompt: "Terraform's state says m5.large, but the server is really m5.xlarge. What is this, and what will the next apply do?",
      options: ["A bug; nothing", "Drift; it will change the server back to m5.large unless the code is updated", "An import; nothing", "A module; delete it"],
      answer: 1,
      explanation: "Reconcile drift deliberately.",
    },
    {
      id: "iacq12",
      prompt: "Who should run terraform apply in production?",
      options: ["Any engineer", "Only the pipeline, after review and policy checks", "The newest team member", "Customers"],
      answer: 1,
      explanation: "People review; the pipeline acts.",
    },
  ],
};

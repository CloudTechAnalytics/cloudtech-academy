---
title: Providers, resources and the workflow
minutes: 25
summary: Read and write Terraform's language (HCL) - providers, resources, arguments and references - and learn the init, plan and apply workflow by running real Terraform in Colab with providers that need no cloud account.
---

## The problem

To review a Terraform change, you need to read the code it changes. And the best way to understand what `plan` and `apply` do is to run them yourself, safely. Terraform has providers that work entirely on your own machine, so you can practise the whole workflow in Colab without a cloud account or a bill.

## The concept

### HCL

Terraform files (`.tf`) use HashiCorp Configuration Language. The main building block is a **resource**: a type, a name, and arguments.

```hcl
provider "aws" {
  region = "af-south-1"
}

resource "aws_instance" "api" {
  count         = 4
  ami           = "ami-0a1b2c3d4e5f60718"
  instance_type = "m5.2xlarge"

  tags = {
    Name        = "prod-api-0${count.index + 1}"
    environment = "production"
    team        = "platform"
  }
}

resource "aws_lb_target_group_attachment" "api" {
  count            = 4
  target_group_arn = aws_lb_target_group.api.arn
  target_id        = aws_instance.api[count.index].id
}
```

- A **provider** is a plugin that talks to a platform's API (AWS, Azure, Google Cloud, GitHub and many more).
- `aws_instance.api` is the resource's **address**; with `count = 4`, its instances are `aws_instance.api[0]` to `[3]`.
- `aws_instance.api[count.index].id` is a **reference**: Terraform works out the order (create the servers before attaching them).

### The workflow

| Command | Does |
| :-- | :-- |
| `terraform init` | download the providers the code uses |
| `terraform fmt` | format files consistently |
| `terraform validate` | check the code is valid |
| `terraform plan` | compare code with state and reality, and show what would change |
| `terraform apply` | make the changes (after showing the plan again) |

Nothing changes until `apply`. In a team, `plan` runs automatically on every pull request, and `apply` runs from the pipeline after review.

![Four steps: terraform init, fmt and validate, terraform plan (which changes nothing), terraform apply (which changes real infrastructure), with an example plan command.](/images/courses/terraform/workflow.svg "The workflow: plan is safe any time; apply runs after review.")

## Example

Try the workflow in Colab. This installs Terraform and uses two providers that run locally: `random` (generates values) and `local` (writes files). It needs the internet, so it isn't run as part of this lesson's checks; the output shown is from a real run.

```bash norun
%%bash
wget -q https://releases.hashicorp.com/terraform/1.9.5/terraform_1.9.5_linux_amd64.zip
unzip -o -q terraform_1.9.5_linux_amd64.zip
mkdir -p demo && cd demo
cat > main.tf <<'EOF'
resource "random_password" "db" {
  length = 20
}

resource "local_file" "config" {
  filename = "config.txt"
  content  = "environment=staging"
}
EOF
../terraform init -no-color > /dev/null
../terraform apply -auto-approve -no-color | tail -n 1
```

```text nocheck
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

Now change the file's content and plan again:

```bash norun
%%bash
cd demo
sed -i 's/environment=staging/environment=production/' main.tf
../terraform plan -no-color | grep -E "^  #|^-/\+|^Plan"
```

```text nocheck
-/+ destroy and then create replacement
  # local_file.config must be replaced
-/+ resource "local_file" "config" {
Plan: 1 to add, 0 to change, 1 to destroy.
```

Changing `content` **replaces** the file: Terraform will delete it and create a new one, because that argument can't be changed in place. For a text file, harmless. For a database, a disaster, as lesson 6 shows.

Back to Tallybook. Count the instances of each resource in its state, by address:

```python
import json
from urllib.request import urlopen

import pandas as pd

with urlopen("https://academy.cloudtechanalytics.com/datasets/terraform/terraform.tfstate") as f:
    state = json.load(f)

pd.DataFrame([{"address": f"{r['type']}.{r['name']}", "instances": len(r["instances"])} for r in state["resources"]])
```

```text
address  instances
0                aws_instance.web          6
1                aws_instance.api          4
2             aws_instance.worker          3
3            aws_instance.staging          6
4            aws_db_instance.prod          1
5         aws_db_instance.staging          1
6                     aws_lb.prod          1
7                  aws_lb.staging          1
8     aws_s3_bucket.invoices_prod          1
9        aws_s3_bucket.db_backups          1
10   aws_s3_bucket.website_assets          1
11         aws_s3_bucket.app_logs          1
12  aws_security_group_rule.rules         10
```

## Walkthrough

1. If you can, run the Colab cells, then `../terraform state list` in the demo folder. What does it show?
2. Write the HCL for Tallybook's three worker servers (`m5.xlarge`, team `invoicing`), following the API example.
3. Which addresses in Tallybook's state use `count` (more than one instance)?
4. In the API example, what would break if `count` changed to 3 in one resource but not the other?

## Practice

```answer
{
  "id": "iac-02-p1",
  "prompt": "How many **resource blocks** (addresses, not instances) are in Tallybook's state?",
  "answer": 13,
  "format": "number",
  "pyVerify": "len(state['resources'])",
  "hint": "The number of rows in the table.",
  "required": true
}
```

```task
{
  "id": "iac-02-t1",
  "prompt": "Write the **HCL** for Tallybook's three invoice worker servers: an `aws_instance` named `worker`, with `count`, the AMI from the example, instance type `m5.xlarge`, and tags for `Name`, `environment` and `team` (`invoicing`).",
  "minutes": 6,
  "rows": 12,
  "placeholder": "resource \"aws_instance\" \"worker\" {\n  ...",
  "rules": [
    { "label": "An aws_instance resource named worker", "pattern": "resource\\s+\"aws_instance\"\\s+\"worker\"\\s*\\{" },
    { "label": "count = 3", "pattern": "count\\s*=\\s*3" },
    { "label": "instance_type = \"m5.xlarge\"", "pattern": "instance_type\\s*=\\s*\"m5\\.xlarge\"" },
    { "label": "An ami argument", "pattern": "ami\\s*=\\s*\"ami-" },
    { "label": "Tags with Name, environment and team", "pattern": "tags\\s*=\\s*\\{[\\s\\S]*Name[\\s\\S]*environment[\\s\\S]*team|tags\\s*=\\s*\\{[\\s\\S]*team[\\s\\S]*environment" },
    { "label": "team is invoicing", "pattern": "team\\s*=\\s*\"invoicing\"" }
  ],
  "sample": "resource \"aws_instance\" \"worker\" {\n  count         = 3\n  ami           = \"ami-0a1b2c3d4e5f60718\"\n  instance_type = \"m5.xlarge\"\n\n  tags = {\n    Name        = \"prod-worker-0${count.index + 1}\"\n    environment = \"production\"\n    team        = \"invoicing\"\n  }\n}",
  "note": "Using count.index in the Name tag gives each server its own name from one block.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does `terraform plan` do?",
    "options": ["Makes the changes", "Shows what would change, without changing anything", "Downloads providers", "Deletes the state"],
    "answer": 1,
    "explanation": "Only apply changes infrastructure."
  },
  {
    "prompt": "With `count = 4`, how are the instances addressed?",
    "options": ["api1 to api4", "aws_instance.api[0] to aws_instance.api[3]", "api-a to api-d", "They can't be"],
    "answer": 1,
    "explanation": "count instances are indexed from 0."
  },
  {
    "prompt": "What is a provider?",
    "options": ["A cloud bill", "A plugin that lets Terraform manage a platform through its API", "A server", "A variable"],
    "answer": 1,
    "explanation": "Providers exist for AWS, Azure, GCP, GitHub and many more."
  }
]
```

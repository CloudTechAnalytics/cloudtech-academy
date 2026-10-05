---
title: Files and permissions
minutes: 25
summary: Read Linux file permissions (owner, group, others; read, write, execute), translate them to numbers like 644 and 600, and find the files on Tallybook's server that anyone could read or change.
---

## The problem

The scanner in lesson 2 asked for `.env`, the file where apps keep secrets such as database passwords and API keys. It didn't get it from the web. But anyone who gets **onto** the server (and lesson 6 shows someone did) can read any file the permissions allow.

Here's the listing of Tallybook's app folder, `/srv/tallybook`, taken with `ls -la`. Several lines should worry you.

## The concept

### Reading a permission string

`-rw-r--r--` is ten characters:

| Position | Meaning |
| :-- | :-- |
| 1 | type: `-` file, `d` directory |
| 2 to 4 | the **owner's** permissions |
| 5 to 7 | the **group's** permissions |
| 8 to 10 | **others'**: everyone else on the machine |

`r` read, `w` write, `x` execute (for a directory, `x` means you can enter it).

### Numbers

Each set of three is a digit: r = 4, w = 2, x = 1, added. `rw-` = 6, `r--` = 4, `rwx` = 7. So `-rw-r--r--` is **644** and `-rw-------` is **600**.

![The string -rwxr-x--- decoded: type file; owner rwx is 4+2+1 = 7; group r-x is 4+0+1 = 5; others --- is 0; so 750.](/images/courses/linux/permissions.svg "Decoding a permission string into its number.")

| Typical setting | Use |
| :-- | :-- |
| 600 | secrets and private keys: owner only |
| 640 | config the app's group may read |
| 644 | ordinary files anyone may read |
| 755 | programs and folders anyone may run or enter |
| 777 | **anyone can change it**: almost never right |

### Changing them

`chmod 600 .env` sets permissions; `chown tallybook:tallybook file` sets the owner and group. On a real server you'd fix things with these; here you'll find what needs fixing.

## Example

```bash
%%bash
curl -sO https://academy.cloudtechanalytics.com/datasets/linux/ls.txt
cat ls.txt
```

```text
total 72
drwxr-xr-x  7 tallybook tallybook  4096 Aug 31 09:12 .
drwxr-xr-x  3 root      root       4096 Jan 15  2026 ..
-rw-rw-rw-  1 tallybook tallybook   612 Jul  3 14:20 .env
-rw-r--r--  1 tallybook tallybook   419 Jan 15  2026 deploy_key
-rw-r--r--  1 tallybook tallybook   103 Jan 15  2026 deploy_key.pub
-rw-r-----  1 tallybook tallybook  2210 Aug 12 11:05 config.json
-rw-r--r--  1 tallybook tallybook  1893 Aug 28 16:40 package.json
-rw-r--r--  1 tallybook tallybook 48211 Aug 28 16:40 server.js
drwxr-xr-x 412 tallybook tallybook 16384 Aug 28 16:41 node_modules
drwxr-xr-x  2 tallybook tallybook  4096 Aug 28 16:40 public
drwxrwxrwx  9 tallybook tallybook  4096 Aug 31 08:55 uploads
drwxr-xr-x  2 tallybook tallybook  4096 Aug 31 00:00 logs
drwxr-xr-x  2 tallybook tallybook  4096 Mar  2  2026 scripts
-rwxrwxrwx  1 tallybook tallybook   740 Mar  2  2026 backup.sh
```

Which entries can **others** write to? The 9th character of the permission string is others' `w`:

```bash
%%bash
awk 'NR > 1 && substr($1, 9, 1) == "w" {print $1, $NF}' ls.txt
```

```text
-rw-rw-rw- .env
drwxrwxrwx uploads
-rwxrwxrwx backup.sh
```

Any user or program on the server can change `.env` (and read it), add or replace files in `uploads`, and edit `backup.sh`, a script that probably runs as a scheduled job. An attacker who edits `backup.sh` gets their code run automatically. Now files that **others** can read, but shouldn't:

```bash
%%bash
awk 'NR > 1 && substr($1, 8, 1) == "r" && ($NF == ".env" || $NF == "deploy_key")' ls.txt
```

```text
-rw-rw-rw-  1 tallybook tallybook   612 Jul  3 14:20 .env
-rw-r--r--  1 tallybook tallybook   419 Jan 15  2026 deploy_key
```

`deploy_key` is a **private** SSH key (the `.pub` file beside it is the public half, which is fine to share). Readable by everyone, it lets anyone on the server log in wherever that key is trusted. Private keys must be 600.

## Walkthrough

1. Run the cells. Write the number (like 644) for every entry in the listing.
2. Write the `chmod` commands that fix each problem (the task below).
3. `config.json` is `-rw-r-----` (640). Who can read it?
4. Why might `uploads` have been made 777 in the first place, and what's a safer way to achieve the same?

## Practice

```answer
{
  "id": "lnx-04-p1",
  "prompt": "What is the **number** for the permission string `-rw-r-----`?",
  "answer": 640,
  "format": "number",
  "hint": "rw- is 6, r-- is 4, --- is 0.",
  "required": true
}
```

```answer
{
  "id": "lnx-04-p2",
  "prompt": "How many entries in ls.txt can **others** write to?",
  "answer": 3,
  "format": "number",
  "pyVerify": "sum(1 for l in open('https://academy.cloudtechanalytics.com/datasets/linux/ls.txt', encoding='utf-8').read().splitlines()[1:] if l[8] == 'w')",
  "hint": "The output of the first awk command.",
  "required": true
}
```

```task
{
  "id": "lnx-04-t1",
  "prompt": "Write the **commands that fix** the permission problems in `/srv/tallybook`, one per line, with a short comment after `#` on each saying why. Cover `.env`, `deploy_key`, `uploads` and `backup.sh`.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "chmod 600 .env   # ...",
  "rules": [
    { "label": ".env set to 600 or 640", "pattern": "chmod\\s+6[04]0\\s+\\.env" },
    { "label": "deploy_key set to 600", "pattern": "chmod\\s+600\\s+deploy_key\\b" },
    { "label": "uploads no longer world-writable (750, 755 or 770)", "pattern": "chmod\\s+7[57][05]\\s+uploads" },
    { "label": "backup.sh no longer world-writable (700, 750 or 755)", "pattern": "chmod\\s+7[05][05]\\s+backup\\.sh" },
    { "label": "A reason on each line", "pattern": "#\\s*\\S", "min": 4 },
    { "label": "No 777 or 666", "pattern": "chmod\\s+(777|666)", "absent": true }
  ],
  "sample": "chmod 600 .env          # secrets: only the app's user may read or change them\nchmod 600 deploy_key    # a private key must be readable by its owner only\nchmod 750 uploads       # the app writes uploads; its group may read; others get nothing\nchmod 750 backup.sh     # only the owner may edit the script that runs on a schedule",
  "note": "After fixing permissions, rotate the secrets in .env and replace deploy_key: anyone on the server could have copied them already.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does `-rw-------` (600) allow?",
    "options": ["Everyone to read", "Only the owner to read and write", "Only the group to read", "Nothing"],
    "answer": 1,
    "explanation": "The right setting for secrets and private keys."
  },
  {
    "prompt": "Why is a world-writable script that runs on a schedule dangerous?",
    "options": ["It wastes disk", "Anyone on the server can change it, and their code then runs automatically", "It runs slower", "It can't be backed up"],
    "answer": 1,
    "explanation": "Writable plus automatic execution is an open door."
  },
  {
    "prompt": "A private key was readable by everyone for months. After chmod 600, what else must happen?",
    "options": ["Nothing", "Replace the key, because it may already have been copied", "Rename it", "Make it 644"],
    "answer": 1,
    "explanation": "Fixing permissions doesn't undo past exposure."
  }
]
```

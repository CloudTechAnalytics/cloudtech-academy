/**
 * A small Git simulator so learners can practise real Git commands in the lesson page.
 *
 * It models what teaches best: the working folder, the staging area (index), commits, branches, merging
 * (fast-forward, clean and conflicting, with conflict markers), undoing (restore, reset, revert, stash, amend),
 * .gitignore, tags and remotes. Push, pull and clone are simulated (there is no real server). Output
 * follows the wording of real Git. Dependency-free, so scripts/test-content.mjs can run every model answer.
 */

export type Commit = { id: string; message: string; parents: string[]; tree: Record<string, string>; n: number };

export type Repo = {
  initialized: boolean;
  files: Record<string, string>;
  index: Record<string, string>;
  commits: Record<string, Commit>;
  branches: Record<string, string>;
  head: string;
  remotes: Record<string, string>;
  remoteBranches: Record<string, string>;
  stash: { files: Record<string, string>; index: Record<string, string> }[];
  merging: { branch: string; conflicts: string[]; message: string } | null;
  tags: Record<string, string>;
  config: Record<string, string>;
  history: string[];
  counter: number;
};

export type GitResult = { out: string; error: boolean };

export function newRepo(files: Record<string, string> = {}, config: Record<string, string> = { "user.name": "Ada Okafor", "user.email": "ada@example.com" }): Repo {
  return { initialized: false, files: { ...files }, index: {}, commits: {}, branches: {}, head: "main", remotes: {}, remoteBranches: {}, stash: [], merging: null, tags: {}, config: { ...config }, history: [], counter: 0 };
}

// ------------------------------------------------------------------ helpers

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

const lines = (s: string) => (s === "" ? [] : s.replace(/\n$/, "").split("\n"));
const join = (l: string[]) => (l.length ? l.join("\n") + "\n" : "");

function lcsPairs(a: string[], b: string[]): [number, number][] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

type Region = { bs: number; be: number; lines: string[] };

/** The changed regions of `next` compared with `base`: base lines [bs, be) are replaced by `lines`. */
function regions(base: string[], next: string[]): Region[] {
  const out: Region[] = [];
  let i = 0;
  let j = 0;
  for (const [mi, mj] of [...lcsPairs(base, next), [base.length, next.length] as [number, number]]) {
    if (mi > i || mj > j) out.push({ bs: i, be: mi, lines: next.slice(j, mj) });
    i = mi + 1;
    j = mj + 1;
  }
  return out;
}

function applyRegions(base: string[], rs: Region[], s: number, e: number): string[] {
  const out: string[] = [];
  let pos = s;
  for (const r of rs) {
    out.push(...base.slice(pos, r.bs), ...r.lines);
    pos = r.be;
  }
  out.push(...base.slice(pos, e));
  return out;
}

/** Three-way merge of text by lines. Adjacent or overlapping edits to the same place conflict, as in Git. */
export function merge3(base: string, ours: string, theirs: string, theirLabel: string): { text: string; conflict: boolean } {
  const b = lines(base);
  const ro = regions(b, lines(ours));
  const rt = regions(b, lines(theirs));
  const out: string[] = [];
  let conflict = false;
  let pos = 0;
  let po = 0;
  let pt = 0;
  while (po < ro.length || pt < rt.length) {
    const o = ro[po];
    const t = rt[pt];
    const overlap = o && t && o.bs <= t.be && t.bs <= o.be;
    if (!overlap) {
      const take = o && (!t || o.bs <= t.bs) ? ro[po++] : rt[pt++];
      out.push(...b.slice(pos, take.bs), ...take.lines);
      pos = take.be;
      continue;
    }
    let s = Math.min(o.bs, t.bs);
    let e = Math.max(o.be, t.be);
    const go: Region[] = [ro[po++]];
    const gt: Region[] = [rt[pt++]];
    for (let grew = true; grew; ) {
      grew = false;
      if (po < ro.length && ro[po].bs <= e) {
        go.push(ro[po]);
        e = Math.max(e, ro[po++].be);
        grew = true;
      }
      if (pt < rt.length && rt[pt].bs <= e) {
        gt.push(rt[pt]);
        e = Math.max(e, rt[pt++].be);
        grew = true;
      }
    }
    s = Math.min(s, go[0].bs, gt[0].bs);
    const oursText = applyRegions(b, go, s, e);
    const theirsText = applyRegions(b, gt, s, e);
    out.push(...b.slice(pos, s));
    if (oursText.join("\n") === theirsText.join("\n")) out.push(...oursText);
    else {
      conflict = true;
      out.push("<<<<<<< HEAD", ...oursText, "=======", ...theirsText, `>>>>>>> ${theirLabel}`);
    }
    pos = e;
  }
  out.push(...b.slice(pos));
  return { text: join(out), conflict };
}

function unifiedDiff(a: string, b: string): string[] {
  const x = lines(a);
  const y = lines(b);
  const out: string[] = [];
  let i = 0;
  let j = 0;
  for (const [mi, mj] of [...lcsPairs(x, y), [x.length, y.length] as [number, number]]) {
    while (i < mi) out.push("-" + x[i++]);
    while (j < mj) out.push("+" + y[j++]);
    if (mi < x.length) out.push(" " + x[mi]);
    i = mi + 1;
    j = mj + 1;
  }
  return out;
}

// ------------------------------------------------------------------ repository queries

const tip = (r: Repo, branch = r.head) => r.branches[branch];
const headCommit = (r: Repo) => (tip(r) ? r.commits[tip(r)] : undefined);
const headTree = (r: Repo): Record<string, string> => headCommit(r)?.tree ?? {};

function ancestors(r: Repo, id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const c = stack.pop()!;
    if (!c || seen.has(c)) continue;
    seen.add(c);
    stack.push(...(r.commits[c]?.parents ?? []));
  }
  return seen;
}

function mergeBase(r: Repo, a: string, b: string): string | undefined {
  const aa = ancestors(r, a);
  return [...ancestors(r, b)].filter((x) => aa.has(x)).sort((p, q) => r.commits[q].n - r.commits[p].n)[0];
}

/** Commit ids reachable from HEAD, newest first. */
export function reachable(r: Repo, from = tip(r)): Commit[] {
  if (!from) return [];
  return [...ancestors(r, from)].map((id) => r.commits[id]).sort((p, q) => q.n - p.n);
}

const ignoredPatterns = (r: Repo) =>
  lines(r.files[".gitignore"] ?? "")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

function isIgnored(r: Repo, path: string): boolean {
  return ignoredPatterns(r).some((p) => {
    const dir = p.endsWith("/");
    const pat = p.replace(/^\//, "").replace(/\/$/, "");
    const re = new RegExp("^" + pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]") + "$");
    const parts = path.split("/");
    if (dir) return parts.slice(0, -1).some((_, i) => re.test(parts.slice(0, i + 1).join("/")));
    return re.test(path) || parts.some((seg) => re.test(seg));
  });
}

type Change = { path: string; kind: "new file" | "modified" | "deleted" };

function stagedChanges(r: Repo): Change[] {
  const h = headTree(r);
  const out: Change[] = [];
  for (const p of Object.keys(r.index).sort()) {
    if (!(p in h)) out.push({ path: p, kind: "new file" });
    else if (h[p] !== r.index[p]) out.push({ path: p, kind: "modified" });
  }
  for (const p of Object.keys(h).sort()) if (!(p in r.index)) out.push({ path: p, kind: "deleted" });
  return out;
}

function unstagedChanges(r: Repo): Change[] {
  const out: Change[] = [];
  for (const p of Object.keys(r.index).sort()) {
    if (!(p in r.files)) out.push({ path: p, kind: "deleted" });
    else if (r.files[p] !== r.index[p]) out.push({ path: p, kind: "modified" });
  }
  return out;
}

function untracked(r: Repo): string[] {
  return Object.keys(r.files)
    .filter((p) => !(p in r.index) && !isIgnored(r, p))
    .sort();
}

export const isClean = (r: Repo) => !stagedChanges(r).length && !unstagedChanges(r).length && !untracked(r).length && !r.merging;

function statusText(r: Repo): string {
  const out: string[] = [`On branch ${r.head}`];
  if (!tip(r)) out.push("", "No commits yet");
  if (r.merging) {
    out.push("", "You have unmerged paths.", '  (fix conflicts and run "git commit")', '  (use "git merge --abort" to abort the merge)');
    out.push("", "Unmerged paths:", '  (use "git add <file>..." to mark resolution)');
    for (const p of r.merging.conflicts) out.push(`\tboth modified:   ${p}`);
  }
  const staged = stagedChanges(r);
  if (staged.length) {
    out.push("", "Changes to be committed:", tip(r) ? '  (use "git restore --staged <file>..." to unstage)' : '  (use "git rm --cached <file>..." to unstage)');
    for (const c of staged) out.push(`\t${(c.kind + ":").padEnd(12)} ${c.path}`);
  }
  const unstaged = unstagedChanges(r).filter((c) => !r.merging?.conflicts.includes(c.path));
  if (unstaged.length) {
    out.push("", "Changes not staged for commit:", '  (use "git add <file>..." to update what will be committed)', '  (use "git restore <file>..." to discard changes in working directory)');
    for (const c of unstaged) out.push(`\t${(c.kind + ":").padEnd(12)} ${c.path}`);
  }
  const u = untracked(r);
  if (u.length) {
    out.push("", "Untracked files:", '  (use "git add <file>..." to include in what will be committed)');
    for (const p of u) out.push(`\t${p}`);
  }
  if (!staged.length && !unstaged.length && !u.length && !r.merging) out.push(tip(r) ? "nothing to commit, working tree clean" : 'nothing to commit (create/copy files and use "git add" to track)');
  else if (!staged.length) out.push("", u.length && !unstaged.length ? 'nothing added to commit but untracked files present (use "git add" to track)' : 'no changes added to commit (use "git add" and/or "git commit -a")');
  return out.join("\n");
}

// ------------------------------------------------------------------ revisions

function resolveRev(r: Repo, spec: string): string | undefined {
  let m = spec.match(/^(.*?)((?:[~^]\d*)*)$/);
  if (!m) return undefined;
  let base = m[1] || "HEAD";
  let id: string | undefined;
  if (base === "HEAD") id = tip(r);
  else if (r.branches[base]) id = r.branches[base];
  else if (r.tags[base]) id = r.tags[base];
  else if (r.remoteBranches[base]) id = r.remoteBranches[base];
  else id = Object.keys(r.commits).find((c) => c.startsWith(base));
  for (const step of m[2].match(/[~^]\d*/g) ?? []) {
    if (!id) return undefined;
    const count = step.length > 1 ? Number(step.slice(1)) : 1;
    for (let k = 0; k < (step[0] === "~" ? count : 1); k++) id = r.commits[id!]?.parents[0];
  }
  return id;
}

// ------------------------------------------------------------------ commits and checkout

function makeCommit(r: Repo, message: string, parents: string[]): Commit {
  r.counter++;
  const tree = { ...r.index };
  const id = hash(message + parents.join(",") + r.counter + JSON.stringify(tree));
  const c: Commit = { id: id.slice(0, 7), message, parents, tree, n: r.counter };
  r.commits[c.id] = c;
  return c;
}

function setWorkingTo(r: Repo, tree: Record<string, string>, oldTree: Record<string, string>) {
  // Files unchanged since the old commit follow the new commit. Locally modified or untracked files stay.
  for (const p of Object.keys(oldTree)) if (p in r.files && r.files[p] === oldTree[p] && !(p in tree)) delete r.files[p];
  for (const p of Object.keys(tree)) if (!(p in r.files) || r.files[p] === oldTree[p] || !(p in oldTree)) r.files[p] = tree[p];
  r.index = { ...tree };
}

function checkout(r: Repo, branch: string): GitResult {
  const old = headTree(r);
  const next = r.commits[r.branches[branch]]?.tree ?? {};
  const dirty = stagedChanges(r).length || unstagedChanges(r).some((c) => (old[c.path] ?? "") !== (next[c.path] ?? ""));
  if (dirty && JSON.stringify(old) !== JSON.stringify(next)) {
    const files = [...new Set([...stagedChanges(r), ...unstagedChanges(r)].map((c) => c.path))];
    return { out: `error: Your local changes to the following files would be overwritten by checkout:\n\t${files.join("\n\t")}\nPlease commit your changes or stash them before you switch branches.\nAborting`, error: true };
  }
  const modified = unstagedChanges(r);
  r.head = branch;
  setWorkingTo(r, next, old);
  for (const c of modified) if (c.kind === "modified" && c.path in r.files) r.index[c.path] = next[c.path] ?? r.index[c.path] ?? "";
  return { out: `Switched to branch '${branch}'`, error: false };
}

function pathsMatching(_r: Repo, spec: string, universe: string[]): string[] {
  if (spec === "." || spec === "./") return universe;
  const dir = spec.replace(/\/$/, "");
  return universe.filter((p) => p === dir || p.startsWith(dir + "/"));
}

// ------------------------------------------------------------------ the shell

function tokenize(line: string): string[] | null {
  const out: string[] = [];
  let cur = "";
  let quote: string | null = null;
  let has = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
    } else if (/\s/.test(ch)) {
      if (cur || has) out.push(cur);
      cur = "";
      has = false;
    } else if (ch === ">" ) {
      if (cur || has) out.push(cur);
      cur = "";
      has = false;
      if (line[i + 1] === ">") {
        out.push(">>");
        i++;
      } else out.push(">");
    } else cur += ch;
  }
  if (quote) return null;
  if (cur || has) out.push(cur);
  return out;
}

const ok = (out = ""): GitResult => ({ out, error: false });
const fail = (out: string): GitResult => ({ out, error: true });

function shell(r: Repo, cmd: string, args: string[]): GitResult {
  switch (cmd) {
    case "ls": {
      const all = args.includes("-a");
      const names = new Set<string>();
      for (const p of Object.keys(r.files)) names.add(p.split("/")[0] + (p.includes("/") ? "/" : ""));
      if (all && r.initialized) names.add(".git/");
      const list = [...names].filter((n) => all || !n.startsWith(".")).sort();
      return ok(list.join("  "));
    }
    case "pwd":
      return ok("/home/learner/project");
    case "clear":
      return ok("\u0000clear");
    case "cat": {
      if (!args.length) return fail("cat: missing file name");
      const out: string[] = [];
      for (const f of args) {
        if (!(f in r.files)) return fail(`cat: ${f}: No such file or directory`);
        out.push(r.files[f].replace(/\n$/, ""));
      }
      return ok(out.join("\n"));
    }
    case "touch":
      for (const f of args) if (!(f in r.files)) r.files[f] = "";
      return ok();
    case "mkdir":
      return ok();
    case "rm": {
      const targets = args.filter((a) => !a.startsWith("-"));
      for (const f of targets) {
        const hit = pathsMatching(r, f, Object.keys(r.files)).filter((p) => p === f || args.includes("-r") || args.includes("-rf"));
        if (!hit.length) return fail(`rm: cannot remove '${f}': No such file or directory`);
        for (const p of hit) delete r.files[p];
      }
      return ok();
    }
    case "mv": {
      const [a, b] = args;
      if (!(a in r.files)) return fail(`mv: cannot stat '${a}': No such file or directory`);
      r.files[b] = r.files[a];
      delete r.files[a];
      return ok();
    }
    case "echo": {
      const gt = args.findIndex((a) => a === ">" || a === ">>");
      const text = (gt >= 0 ? args.slice(0, gt) : args).filter((a) => a !== "-e" && a !== "-n").join(" ").replace(/\\n/g, "\n");
      if (gt < 0) return ok(text);
      const file = args[gt + 1];
      if (!file) return fail("syntax error: no file after >");
      r.files[file] = (args[gt] === ">>" ? r.files[file] ?? "" : "") + text + "\n";
      return ok();
    }
    case "help":
      return ok("Commands you can use here: git (init, status, add, commit, log, diff, branch, switch, checkout, merge, restore, reset, revert, stash, tag, remote, push, pull, config), ls, cat, echo, touch, rm, mv, pwd, clear.\nUse the file editor beside the terminal to change files. echo \"text\" > file also writes a file.");
    default:
      return fail(`${cmd}: command not found. Type help to see what you can use in this practice terminal.`);
  }
}

// ------------------------------------------------------------------ git commands

function git(r: Repo, args: string[]): GitResult {
  const sub = args[0];
  const rest = args.slice(1);
  if (!sub) return ok("usage: git <command> [<args>]\nCommon commands: init, status, add, commit, log, diff, branch, switch, merge, restore, reset, stash, remote, push, pull");
  if (sub === "--version") return ok("git version 2.45.0");
  if (sub === "init") {
    if (r.initialized) return ok("Reinitialized existing Git repository in /home/learner/project/.git/");
    r.initialized = true;
    r.head = "main";
    return ok("Initialized empty Git repository in /home/learner/project/.git/");
  }
  if (sub === "config") {
    const a = rest.filter((x) => x !== "--global" && x !== "--local");
    if (a[0] === "--list" || a[0] === "-l") return ok(Object.entries(r.config).map(([k, v]) => `${k}=${v}`).join("\n"));
    if (a[0] === "--get") return a[1] in r.config ? ok(r.config[a[1]]) : fail("");
    if (a.length === 1) return a[0] in r.config ? ok(r.config[a[0]]) : ok("");
    if (a.length >= 2) {
      r.config[a[0]] = a[1];
      return ok();
    }
    return fail("usage: git config [<options>]");
  }
  if (!r.initialized) return fail("fatal: not a git repository (or any of the parent directories): .git");

  switch (sub) {
    case "status":
      return ok(statusText(r));
    case "add": {
      const targets = rest.filter((a) => !a.startsWith("-"));
      const all = rest.includes("-A") || rest.includes("--all") || rest.includes(".") || rest.includes("-u");
      if (!targets.length && !all) return fail("Nothing specified, nothing added.\nhint: Maybe you wanted to say 'git add .'?");
      const specs = rest.includes("-A") || rest.includes("--all") || (rest.includes("-u") && !targets.length) ? ["."] : targets;
      for (const spec of specs) {
        const live = pathsMatching(r, spec, Object.keys(r.files)).filter((p) => !isIgnored(r, p) || spec === p);
        const gone = pathsMatching(r, spec, Object.keys(r.index)).filter((p) => !(p in r.files));
        if (!live.length && !gone.length) return fail(`fatal: pathspec '${spec}' did not match any files`);
        for (const p of live) {
          if (isIgnored(r, p) && spec !== p) continue;
          if (rest.includes("-u") && !(p in r.index)) continue;
          r.index[p] = r.files[p];
        }
        for (const p of gone) delete r.index[p];
        if (r.merging) r.merging.conflicts = r.merging.conflicts.filter((c) => !live.includes(c));
      }
      return ok();
    }
    case "rm": {
      const cached = rest.includes("--cached");
      for (const spec of rest.filter((a) => !a.startsWith("-"))) {
        const hit = pathsMatching(r, spec, Object.keys(r.index));
        if (!hit.length) return fail(`fatal: pathspec '${spec}' did not match any files`);
        for (const p of hit) {
          delete r.index[p];
          if (!cached) delete r.files[p];
        }
      }
      return ok();
    }
    case "commit": {
      const mi = rest.findIndex((a) => a === "-m" || a === "-am" || a === "-ma");
      const amend = rest.includes("--amend");
      const message = mi >= 0 ? rest[mi + 1] : undefined;
      if (rest.includes("-a") || rest.includes("-am")) for (const c of unstagedChanges(r)) c.kind === "deleted" ? delete r.index[c.path] : (r.index[c.path] = r.files[c.path]);
      if (!r.config["user.name"] || !r.config["user.email"]) return fail("Author identity unknown\n\n*** Please tell me who you are.\n\nRun\n\n  git config --global user.email \"you@example.com\"\n  git config --global user.name \"Your Name\"\n\nto set your account's default identity.\nfatal: unable to auto-detect email address");
      if (r.merging) {
        if (r.merging.conflicts.length) return fail(`error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use 'git add <file>'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.`);
        const c = makeCommit(r, message ?? r.merging.message, [tip(r), r.branches[r.merging.branch]]);
        r.branches[r.head] = c.id;
        r.merging = null;
        return ok(`[${r.head} ${c.id}] ${c.message}`);
      }
      if (amend) {
        const old = headCommit(r);
        if (!old) return fail("fatal: You have nothing to amend.");
        const c = makeCommit(r, message ?? old.message, old.parents);
        r.branches[r.head] = c.id;
        return ok(`[${r.head} ${c.id}] ${c.message}`);
      }
      if (!stagedChanges(r).length) return fail(`On branch ${r.head}
` + (unstagedChanges(r).length || untracked(r).length ? 'no changes added to commit (use "git add" and/or "git commit -a")' : "nothing to commit, working tree clean"));
      if (message === undefined || message.trim() === "") return fail("Aborting commit due to empty commit message. Use: git commit -m \"your message\"");
      const first = !tip(r);
      const changes = stagedChanges(r);
      const c = makeCommit(r, message, tip(r) ? [tip(r)] : []);
      r.branches[r.head] = c.id;
      return ok(`[${r.head} ${first ? "(root-commit) " : ""}${c.id}] ${message}\n ${changes.length} file${changes.length === 1 ? "" : "s"} changed`);
    }
    case "log": {
      if (!tip(r)) return fail(`fatal: your current branch '${r.head}' does not have any commits yet`);
      const oneline = rest.includes("--oneline");
      const nIdx = rest.findIndex((a) => /^-\d+$/.test(a) || a === "-n");
      const limit = nIdx >= 0 ? (rest[nIdx] === "-n" ? Number(rest[nIdx + 1]) : Math.abs(Number(rest[nIdx]))) : Infinity;
      const list = reachable(r).slice(0, limit);
      const decorate = (c: Commit) => {
        const names = [...Object.entries(r.branches).filter(([, id]) => id === c.id).map(([b]) => (b === r.head && c.id === tip(r) ? `HEAD -> ${b}` : b)), ...Object.entries(r.tags).filter(([, id]) => id === c.id).map(([t]) => `tag: ${t}`), ...Object.entries(r.remoteBranches).filter(([, id]) => id === c.id).map(([b]) => b)];
        return names.length ? ` (${names.join(", ")})` : "";
      };
      if (oneline) return ok(list.map((c) => `${c.id}${decorate(c)} ${c.message}`).join("\n"));
      return ok(list.map((c) => `commit ${c.id}${decorate(c)}\nAuthor: ${r.config["user.name"]} <${r.config["user.email"]}>\n\n    ${c.message}\n`).join("\n"));
    }
    case "diff": {
      const staged = rest.includes("--staged") || rest.includes("--cached");
      const out: string[] = [];
      if (staged) {
        const h = headTree(r);
        for (const c of stagedChanges(r)) {
          out.push(`diff --git a/${c.path} b/${c.path}`, c.kind === "new file" ? "new file" : c.kind === "deleted" ? "deleted file" : "index changed", ...unifiedDiff(h[c.path] ?? "", r.index[c.path] ?? ""));
        }
      } else {
        for (const c of unstagedChanges(r)) out.push(`diff --git a/${c.path} b/${c.path}`, ...unifiedDiff(r.index[c.path] ?? "", r.files[c.path] ?? ""));
      }
      return ok(out.join("\n"));
    }
    case "branch": {
      const del = rest.find((a) => a === "-d" || a === "-D");
      const names = rest.filter((a) => !a.startsWith("-"));
      if (del) {
        const n = names[0];
        if (!(n in r.branches)) return fail(`error: branch '${n}' not found.`);
        if (n === r.head) return fail(`error: Cannot delete branch '${n}' checked out at '/home/learner/project'`);
        if (del === "-d" && !ancestors(r, tip(r)).has(r.branches[n])) return fail(`error: the branch '${n}' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D ${n}'.`);
        const id = r.branches[n];
        delete r.branches[n];
        return ok(`Deleted branch ${n} (was ${id}).`);
      }
      if (rest.includes("-m") && names.length) {
        const [from, to] = names.length === 2 ? names : [r.head, names[0]];
        if (!(from in r.branches) && from !== r.head) return fail(`error: refname refs/heads/${from} not found`);
        if (from in r.branches) {
          r.branches[to] = r.branches[from];
          delete r.branches[from];
        }
        if (r.head === from) r.head = to;
        return ok();
      }
      if (names.length) {
        if (!tip(r)) return fail(`fatal: not a valid object name: '${r.head}'`);
        if (names[0] in r.branches) return fail(`fatal: a branch named '${names[0]}' already exists`);
        r.branches[names[0]] = tip(r);
        return ok();
      }
      const all = Object.keys(r.branches).sort();
      if (!all.length) return ok();
      return ok(all.map((b) => `${b === r.head ? "* " : "  "}${b}`).join("\n"));
    }
    case "switch":
    case "checkout": {
      const make = rest.find((a) => a === "-c" || a === "-b" || a === "-C");
      const names = rest.filter((a) => !a.startsWith("-"));
      if (sub === "checkout" && names.length && !make && names[0] !== "--" && !(names[0] in r.branches)) {
        // git checkout -- file : restore a file
        const files = rest.filter((a) => a !== "--");
        return git(r, ["restore", ...files]);
      }
      if (rest.includes("--")) return git(r, ["restore", ...rest.filter((a) => a !== "--")]);
      const n = names[0];
      if (!n) return fail(`fatal: missing branch name`);
      if (make) {
        if (n in r.branches) return fail(`fatal: a branch named '${n}' already exists`);
        if (!tip(r)) {
          r.head = n;
          return ok(`Switched to a new branch '${n}'`);
        }
        r.branches[n] = tip(r);
        r.head = n;
        return ok(`Switched to a new branch '${n}'`);
      }
      if (!(n in r.branches)) return fail(`fatal: invalid reference: ${n}`);
      if (n === r.head) return ok(`Already on '${n}'`);
      return checkout(r, n);
    }
    case "merge": {
      if (rest.includes("--abort")) {
        if (!r.merging) return fail("fatal: There is no merge to abort (MERGE_HEAD missing).");
        r.merging = null;
        r.index = { ...headTree(r) };
        r.files = { ...r.files, ...headTree(r) };
        for (const p of Object.keys(r.files)) if (!(p in r.index) && p in (headCommit(r)?.tree ?? {})) delete r.files[p];
        return ok();
      }
      const name = rest.filter((a) => !a.startsWith("-"))[0];
      const mi = rest.indexOf("-m");
      const msg = mi >= 0 ? rest[mi + 1] : undefined;
      if (!name) return fail("fatal: No commit specified and merge.defaultToUpstream not set.");
      if (!(name in r.branches)) return fail(`merge: ${name} - not something we can merge`);
      if (r.merging) return fail("fatal: You have not concluded your merge (MERGE_HEAD exists).");
      if (stagedChanges(r).length || unstagedChanges(r).length) return fail("error: Your local changes would be overwritten by merge.\nPlease commit your changes or stash them before you merge.\nAborting");
      const ours = tip(r);
      const theirs = r.branches[name];
      if (ancestors(r, ours).has(theirs)) return ok("Already up to date.");
      const old = headTree(r);
      if (ancestors(r, theirs).has(ours) && !rest.includes("--no-ff")) {
        const next = r.commits[theirs].tree;
        r.branches[r.head] = theirs;
        setWorkingTo(r, next, old);
        return ok(`Updating ${ours}..${theirs}\nFast-forward`);
      }
      const base = mergeBase(r, ours, theirs);
      const bt = base ? r.commits[base].tree : {};
      const tt = r.commits[theirs].tree;
      const paths = new Set([...Object.keys(old), ...Object.keys(tt), ...Object.keys(bt)]);
      const conflicts: string[] = [];
      const log: string[] = [];
      const index = { ...old };
      for (const p of [...paths].sort()) {
        const b = bt[p];
        const o = old[p];
        const t = tt[p];
        if (o === t) continue;
        if (o === b) {
          if (t === undefined) {
            delete index[p];
            delete r.files[p];
          } else {
            index[p] = t;
            r.files[p] = t;
          }
          continue;
        }
        if (t === b) continue;
        const merged = merge3(b ?? "", o ?? "", t ?? "", name);
        r.files[p] = merged.text;
        if (merged.conflict) {
          conflicts.push(p);
          log.push(`Auto-merging ${p}`, `CONFLICT (content): Merge conflict in ${p}`);
        } else {
          index[p] = merged.text;
          log.push(`Auto-merging ${p}`);
        }
      }
      r.index = index;
      const message = msg ?? `Merge branch '${name}'`;
      if (conflicts.length) {
        r.merging = { branch: name, conflicts, message };
        return fail([...log, "Automatic merge failed; fix conflicts and then commit the result."].join("\n"));
      }
      const c = makeCommit(r, message, [ours, theirs]);
      r.branches[r.head] = c.id;
      return ok([...log, "Merge made by the 'ort' strategy."].join("\n"));
    }
    case "restore": {
      const staged = rest.includes("--staged");
      const specs = rest.filter((a) => !a.startsWith("-"));
      if (!specs.length) return fail("fatal: you must specify path(s) to restore");
      for (const spec of specs) {
        if (staged) {
          const hit = pathsMatching(r, spec, [...new Set([...Object.keys(r.index), ...Object.keys(headTree(r))])]);
          if (!hit.length) return fail(`error: pathspec '${spec}' did not match any file(s) known to git`);
          for (const p of hit) {
            if (p in headTree(r)) r.index[p] = headTree(r)[p];
            else delete r.index[p];
          }
        } else {
          const hit = pathsMatching(r, spec, Object.keys(r.index));
          if (!hit.length) return fail(`error: pathspec '${spec}' did not match any file(s) known to git`);
          for (const p of hit) r.files[p] = r.index[p];
        }
      }
      return ok();
    }
    case "reset": {
      const mode = rest.includes("--hard") ? "hard" : rest.includes("--soft") ? "soft" : "mixed";
      const specs = rest.filter((a) => !a.startsWith("-"));
      const rev = specs.find((s) => resolveRev(r, s) !== undefined && !(s in r.files));
      if (!rev) {
        // git reset <file>: unstage
        if (!specs.length) {
          r.index = { ...headTree(r) };
          return ok("Unstaged changes after reset:");
        }
        return git(r, ["restore", "--staged", ...specs]);
      }
      const id = resolveRev(r, rev)!;
      const wasTracked = new Set(Object.keys(r.index));
      r.branches[r.head] = id;
      const tree = r.commits[id].tree;
      if (mode !== "soft") r.index = { ...tree };
      if (mode === "hard") {
        const keep = Object.fromEntries(Object.entries(r.files).filter(([p]) => !wasTracked.has(p) && !(p in tree)));
        r.files = { ...keep, ...tree };
        return ok(`HEAD is now at ${id} ${r.commits[id].message}`);
      }
      return ok();
    }
    case "revert": {
      const rev = rest.filter((a) => !a.startsWith("-"))[0] ?? "HEAD";
      const id = resolveRev(r, rev);
      if (!id) return fail(`fatal: bad revision '${rev}'`);
      if (stagedChanges(r).length || unstagedChanges(r).length) return fail("error: your local changes would be overwritten by revert.\nhint: commit your changes or stash them to proceed.\nfatal: revert failed");
      const c = r.commits[id];
      const parent = c.parents[0] ? r.commits[c.parents[0]].tree : {};
      const conflicts: string[] = [];
      for (const p of new Set([...Object.keys(c.tree), ...Object.keys(parent)])) {
        if (c.tree[p] === parent[p]) continue;
        const cur = r.index[p];
        if (cur === c.tree[p]) {
          if (parent[p] === undefined) {
            delete r.index[p];
            delete r.files[p];
          } else {
            r.index[p] = parent[p];
            r.files[p] = parent[p];
          }
        } else {
          const m = merge3(c.tree[p] ?? "", cur ?? "", parent[p] ?? "", `parent of ${c.id}`);
          r.files[p] = m.text;
          if (m.conflict) conflicts.push(p);
          else r.index[p] = m.text;
        }
      }
      if (conflicts.length) return fail(`CONFLICT (content): Merge conflict in ${conflicts.join(", ")}\nerror: could not revert ${c.id}... ${c.message}`);
      const nc = makeCommit(r, `Revert "${c.message}"`, [tip(r)]);
      r.branches[r.head] = nc.id;
      return ok(`[${r.head} ${nc.id}] Revert "${c.message}"`);
    }
    case "stash": {
      const op = rest[0] ?? "push";
      if (op === "list") return ok(r.stash.map((_, i) => `stash@{${i}}: WIP on ${r.head}`).reverse().join("\n"));
      if (op === "pop" || op === "apply") {
        const s = op === "pop" ? r.stash.pop() : r.stash[r.stash.length - 1];
        if (!s) return fail("No stash entries found.");
        r.files = { ...r.files, ...s.files };
        r.index = { ...r.index, ...s.index };
        return ok(statusText(r) + (op === "pop" ? "\nDropped refs/stash@{0}" : ""));
      }
      const changed = [...unstagedChanges(r), ...stagedChanges(r)];
      if (!changed.length) return ok("No local changes to save");
      const files: Record<string, string> = {};
      const idx: Record<string, string> = {};
      for (const c of changed) {
        if (c.path in r.files) files[c.path] = r.files[c.path];
        if (c.path in r.index) idx[c.path] = r.index[c.path];
      }
      r.stash.push({ files, index: idx });
      const h = headTree(r);
      for (const c of changed) {
        if (c.path in h) r.files[c.path] = h[c.path];
        else delete r.files[c.path];
      }
      r.index = { ...h };
      return ok(`Saved working directory and index state WIP on ${r.head}: ${tip(r)} ${headCommit(r)?.message ?? ""}`);
    }
    case "tag": {
      const names = rest.filter((a) => !a.startsWith("-"));
      if (!names.length) return ok(Object.keys(r.tags).sort().join("\n"));
      if (!tip(r)) return fail("fatal: Failed to resolve 'HEAD' as a valid ref.");
      r.tags[names[0]] = tip(r);
      return ok();
    }
    case "show": {
      const id = resolveRev(r, rest[0] ?? "HEAD");
      if (!id) return fail("fatal: bad revision");
      const c = r.commits[id];
      const parent = c.parents[0] ? r.commits[c.parents[0]].tree : {};
      const out = [`commit ${c.id}`, `Author: ${r.config["user.name"]} <${r.config["user.email"]}>`, "", `    ${c.message}`, ""];
      for (const p of Object.keys({ ...parent, ...c.tree }).sort()) if (parent[p] !== c.tree[p]) out.push(`diff --git a/${p} b/${p}`, ...unifiedDiff(parent[p] ?? "", c.tree[p] ?? ""));
      return ok(out.join("\n"));
    }
    case "remote": {
      if (rest[0] === "add") {
        if (rest.length < 3) return fail("usage: git remote add <name> <url>");
        if (rest[1] in r.remotes) return fail(`error: remote ${rest[1]} already exists.`);
        r.remotes[rest[1]] = rest[2];
        return ok();
      }
      if (rest[0] === "remove" || rest[0] === "rm") {
        delete r.remotes[rest[1]];
        return ok();
      }
      if (rest.includes("-v")) return ok(Object.entries(r.remotes).flatMap(([n, u]) => [`${n}\t${u} (fetch)`, `${n}\t${u} (push)`]).join("\n"));
      return ok(Object.keys(r.remotes).join("\n"));
    }
    case "push": {
      const names = rest.filter((a) => !a.startsWith("-"));
      const remote = names[0] ?? "origin";
      if (!(remote in r.remotes)) return fail(`fatal: '${remote}' does not appear to be a git repository\nfatal: Could not read from remote repository.`);
      const branch = names[1] ?? r.head;
      if (!(branch in r.branches)) return fail(`error: src refspec ${branch} does not match any\nerror: failed to push some refs to '${r.remotes[remote]}'`);
      const key = `${remote}/${branch}`;
      if (r.remoteBranches[key] === r.branches[branch]) return ok("Everything up-to-date");
      const isNew = !(key in r.remoteBranches);
      r.remoteBranches[key] = r.branches[branch];
      return ok(`Enumerating objects... done.\nTo ${r.remotes[remote]}\n ${isNew ? "* [new branch]     " : "   " + r.branches[branch]}${isNew ? `${branch} -> ${branch}` : `  ${branch} -> ${branch}`}${rest.includes("-u") ? `\nbranch '${branch}' set up to track '${key}'.` : ""}`);
    }
    case "pull":
    case "fetch": {
      const remote = rest.filter((a) => !a.startsWith("-"))[0] ?? "origin";
      if (!(remote in r.remotes)) return fail(`fatal: '${remote}' does not appear to be a git repository\nfatal: Could not read from remote repository.`);
      return ok(sub === "pull" ? "Already up to date." : "");
    }
    case "clone":
      return fail("In this practice terminal your project folder already exists, so there is nothing to clone. On your own computer, git clone <url> downloads a copy of a GitHub repository.");
    default:
      return fail(`git: '${sub}' is not a git command in this practice terminal. Try: init, status, add, commit, log, diff, branch, switch, merge, restore, reset, revert, stash, tag, remote, push, pull.`);
  }
}

/** Runs one command line in the practice terminal and returns its output. Records the line in the history. */
export function run(r: Repo, line: string, record = true): GitResult {
  const trimmed = line.trim();
  if (!trimmed) return ok();
  if (record) r.history.push(trimmed);
  const tokens = tokenize(trimmed);
  if (!tokens) return fail("Unclosed quote. Check that every opening quote has a closing one.");
  const [cmd, ...args] = tokens;
  return cmd === "git" ? git(r, args) : shell(r, cmd, args);
}

// ------------------------------------------------------------------ checking tasks

export type GitRule = {
  label: string;
  /** At least this many commits reachable from HEAD. */
  commits?: number;
  /** This branch exists. */
  branch?: string;
  /** HEAD is on this branch. */
  current?: string;
  /** This branch has been merged into HEAD. */
  merged?: string;
  /** A working file exists (with absent: it does not), and matches `contains` if given. */
  file?: string;
  contains?: string;
  /** With file: the content must NOT match this pattern. */
  notContains?: string;
  absent?: boolean;
  /** This file is tracked in the last commit. */
  tracked?: string;
  /** This file is not tracked in the last commit. */
  notTracked?: string;
  /** This branch does not exist. */
  noBranch?: string;
  /** The working tree is clean: nothing to commit. */
  clean?: boolean;
  /** A pattern the commit messages (one per line, newest first) must match. */
  log?: string;
  /** A pattern some command typed by the learner must match, at least `times` times (default 1). */
  ran?: string;
  times?: number;
  /** No file contains conflict markers. */
  noMarkers?: boolean;
  /** The branch has been pushed to origin. */
  pushed?: string;
  /** A remote with this name exists. */
  remote?: string;
  /** A tag with this name exists. */
  tag?: string;
  /** This many stash entries exist. */
  stashed?: number;
  /** Nothing is staged. */
  nothingStaged?: boolean;
  /** A file in the latest commit of another branch (not the working folder) exists, and matches `contains` if given. */
  onBranch?: { branch: string; file: string; contains?: string };
  /** The tip of branch `of` is part of branch `branch`'s history, so `of` has been merged into `branch`. */
  mergedInto?: { branch: string; of: string };
  /** Config values (name to pattern), e.g. { "user.name": ".+" }. */
  config?: Record<string, string>;
};

export type GitTaskSetup = { files: Record<string, string>; setup: string[]; /** false: start with no name and email set */ identity?: boolean };

export function checkRule(r: Repo, rule: GitRule): boolean {
  if (rule.commits !== undefined && reachable(r).length < rule.commits) return false;
  if (rule.branch !== undefined && !(rule.branch in r.branches)) return false;
  if (rule.current !== undefined && r.head !== rule.current) return false;
  if (rule.merged !== undefined && !(rule.merged in r.branches && ancestors(r, tip(r) ?? "").has(r.branches[rule.merged]))) return false;
  if (rule.file !== undefined) {
    const there = rule.file in r.files;
    if (rule.absent) return !there;
    if (!there) return false;
    if (rule.contains !== undefined && !new RegExp(rule.contains, "im").test(r.files[rule.file])) return false;
    if (rule.notContains !== undefined && new RegExp(rule.notContains, "im").test(r.files[rule.file])) return false;
  }
  if (rule.tracked !== undefined && !(rule.tracked in headTree(r))) return false;
  if (rule.notTracked !== undefined && rule.notTracked in headTree(r)) return false;
  if (rule.noBranch !== undefined && rule.noBranch in r.branches) return false;
  if (rule.clean && !isClean(r)) return false;
  if (rule.log !== undefined && !new RegExp(rule.log, "im").test(reachable(r).map((c) => c.message).join("\n"))) return false;
  if (rule.ran !== undefined) {
    const re = new RegExp(rule.ran, "i");
    if (r.history.filter((h) => re.test(h)).length < (rule.times ?? 1)) return false;
  }
  if (rule.noMarkers && Object.values(r.files).some((t) => /^(<<<<<<<|=======|>>>>>>>)/m.test(t))) return false;
  if (rule.pushed !== undefined && !(r.remoteBranches[`origin/${rule.pushed}`] && r.remoteBranches[`origin/${rule.pushed}`] === r.branches[rule.pushed])) return false;
  if (rule.remote !== undefined && !(rule.remote in r.remotes)) return false;
  if (rule.tag !== undefined && !(rule.tag in r.tags)) return false;
  if (rule.stashed !== undefined && r.stash.length !== rule.stashed) return false;
  if (rule.onBranch) {
    const t = r.commits[r.branches[rule.onBranch.branch]]?.tree ?? {};
    const text = t[rule.onBranch.file];
    if (text === undefined) return false;
    if (rule.onBranch.contains !== undefined && !new RegExp(rule.onBranch.contains, "im").test(text)) return false;
  }
  if (rule.mergedInto && !(rule.mergedInto.branch in r.branches && rule.mergedInto.of in r.branches && ancestors(r, r.branches[rule.mergedInto.branch]).has(r.branches[rule.mergedInto.of]))) return false;
  if (rule.nothingStaged && stagedChanges(r).length) return false;
  if (rule.config) for (const [k, pat] of Object.entries(rule.config)) if (!new RegExp(pat, "i").test(r.config[k] ?? "")) return false;
  return true;
}

export function checkGitTask(r: Repo, rules: GitRule[]): { passed: boolean; results: { label: string; passed: boolean }[] } {
  const results = rules.map((x) => ({ label: x.label, passed: checkRule(r, x) }));
  return { passed: results.every((x) => x.passed), results };
}

/** A repository prepared for a task: its starting files, then the setup commands (not recorded as the learner's). */
export function prepare(setup: GitTaskSetup): Repo {
  const r = newRepo(setup.files, setup.identity === false ? {} : undefined);
  for (const line of setup.setup) run(r, line, false);
  return r;
}

/** For the file list beside the terminal: ? untracked, M changed, A staged, U conflict. */
export function fileFlags(r: Repo): Record<string, string> {
  const flags: Record<string, string> = {};
  for (const c of stagedChanges(r)) if (c.path in r.files) flags[c.path] = "A";
  for (const c of unstagedChanges(r)) flags[c.path] = "M";
  for (const p of untracked(r)) flags[p] = "?";
  for (const p of r.merging?.conflicts ?? []) flags[p] = "U";
  return flags;
}

export const commitCount = (r: Repo) => reachable(r).length;

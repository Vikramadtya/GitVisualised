export interface ConceptModule {
  id: string;
  title: string;
  description: string;
  readTime: string;
  markdownContent: string;
  illustrationId?: string;
  relatedCommands?: string[];
  relatedConcepts?: string[];
  relatedScenarios?: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const concepts: ConceptModule[] = [
  {
    id: 'intro-to-git',
    title: 'Introduction to Git',
    description: 'Learn what Git is, why it is essential for modern development, and the basic definitions of repositories, commits, and branches.',
    readTime: '4 min',
    illustrationId: 'intro',
    relatedCommands: ['git init', 'git clone'],
    relatedConcepts: ['vcs-explained', 'git-lifecycle'],
    relatedScenarios: ['foundation'],
    markdownContent: `
# What is Git?

Git is a distributed version control system (VCS) that is widely used for tracking changes in source code during software development. It was created by Linus Torvalds in 2005 and has since become the de facto standard for version control in the software development industry.

Git allows multiple developers to collaborate on a project by providing a history of changes, facilitating the tracking of who made what changes and when.

## Key Definitions

1. **Repository (Repo)**: A Git repository is a directory or storage location where your project's files and version history are stored. There can be a local repository on your computer and remote repositories on servers.
2. **Commit**: A state of the codebase. A commit is a snapshot of your project at a particular point in time. Each commit includes a unique identifier, a message describing the changes, and a reference to the previous commit.
3. **Branch**: A reference to a commit; can have a tracked upstream. Branches allow you to work on different features or parts of your project simultaneously without affecting the main development line.
4. **Tag**: A reference (standard) or an object (annotated) that marks specific points in history, like version releases.
5. **HEAD**: A place where your working directory is now.
6. **Pull Requests (PRs)**: A way for developers to propose changes and have them reviewed by peers before merging.
7. **Merging**: Combining changes from one branch (or multiple) into another.
8. **Remote Repositories**: Copies of your project stored on a different server (like GitHub or GitLab).
9. **Cloning**: The process of creating a copy of a remote repository on your local machine.
10. **Forking**: Creating your own copy of a repository, typically on a hosting platform, so you can make changes without affecting the original project.

## Why we need Git?

1. **Version Control**: Track changes over time. Complete history of what was done, when, and by whom.
2. **Collaboration**: Multiple developers can work simultaneously without interfering with each other.
3. **Branching**: Create isolated environments for new features or bug fixes.
4. **Distributed Development**: Every developer has a complete copy of the project's history locally.
5. **Backup and Recovery**: Distributed locations provide redundancy against data loss.
6. **Code Review**: Platforms like GitHub provide tools to review and discuss code.
7. **Efficiency**: Git only stores changes made to files, resulting in small repo sizes and fast operations.
    `
  },
  {
    id: 'vcs-explained',
    title: 'Version Control Systems (VCS)',
    description: 'Understand the difference between Centralized and Distributed Version Control Systems.',
    readTime: '3 min',
    illustrationId: 'vcs',
    relatedCommands: ['git push', 'git pull', 'git fetch'],
    relatedConcepts: ['intro-to-git'],
    relatedScenarios: ['foundation'],
    markdownContent: `
# What is a Version Control System (VCS)?

A Version Control System (VCS), also commonly referred to as a Source Code Management (SCM) system, is a software tool that helps manage and track changes to files and directories over time. 

The primary purpose is to keep a historical record of all changes, allowing multiple people to collaborate while maintaining the integrity of the codebase.

## Types of VCS

### Centralized Version Control Systems (CVCS)
In a CVCS, there is a single central repository that stores all the project files and their version history. Developers check out files from this central repository, make changes, and then commit those changes back.
*Examples: CVS, Subversion (SVN)*

### Distributed Version Control Systems (DVCS)
In a DVCS, **every developer has a complete copy** of the project's repository, including its full history, on their local machine. This allows developers to work independently, create branches for experimentation, and synchronize their changes with remote repositories.
*Examples: Git, Mercurial, Bazaar*

## Key Benefits of VCS
1. **History Tracking**: Complete history of changes (who, what, when).
2. **Collaboration**: Mechanisms for merging changes and resolving conflicts.
3. **Branching and Isolation**: Safely experiment without breaking the main code.
4. **Revert and Rollback**: Mistakes can easily be undone to a previous state.
    `
  },
  {
    id: 'git-lifecycle',
    title: 'The Git Life Cycle',
    description: 'A step-by-step overview of the sequence of actions taken when using Git to manage source code.',
    readTime: '5 min',
    illustrationId: 'lifecycle',
    relatedCommands: ['git add', 'git commit', 'git status', 'git branch', 'git merge'],
    relatedConcepts: ['intro-to-git', 'git-setup'],
    relatedScenarios: ['foundation'],
    markdownContent: `
# The Git Life Cycle

The Git lifecycle refers to the typical sequence of actions and steps you take when using Git to manage your source code and collaborate with others.

1. **Initializing a Repository**: Run \`git init\` to turn a directory into a Git repository.
2. **Working Directory**: Your project files exist here. These are the files you are actively working on.
3. **Staging**: Before you commit changes, you need to stage them using \`git add\`. Staging allows you to select which changes you want to include in the next commit.
4. **Committing**: After staging, use \`git commit\` to create snapshots of your project.
5. **Local Repository**: Commits are permanently stored in your local repository.
6. **Branching**: Use \`git branch\` to create isolated development tracks for features or fixes.
7. **Merging**: Use \`git merge\` to integrate a completed branch back into the main codebase.
8. **Remote Repository**: Host your code on servers like GitHub for collaboration.
9. **Pushing**: Use \`git push\` to share your local commits with the remote repository.
10. **Pulling**: Use \`git pull\` to download and merge changes made by others into your local repository.
11. **Conflict Resolution**: When multiple people change the same part of a file, Git will warn you, and you must manually resolve the conflicts.
12. **Collaboration**: Developers share code via pushing, pulling, and Pull Requests.
13. **Tagging**: Use \`git tag\` to mark specific points in the project's history, such as version releases.
14. **Continuous Cycle**: Repeat these steps indefinitely to manage ongoing development!
    `
  },
  {
    id: 'git-setup',
    title: 'Git Installation & Configuration',
    description: 'How to install Git across platforms and configure your user settings.',
    readTime: '3 min',
    illustrationId: 'setup',
    relatedCommands: ['git config'],
    relatedConcepts: ['intro-to-git'],
    relatedScenarios: ['foundation'],
    markdownContent: `
# Git Installation

To install Git on your computer, you can follow the steps for your specific operating system:

## Windows
1. Go to the official Git for Windows website: [https://gitforwindows.org/](https://gitforwindows.org/)
2. Run the installer and follow the installation steps.
3. *Optional*: Install GitHub Desktop for a graphical user interface (GUI).

## Linux (Debian/Ubuntu)
For GNU/Linux distributions, Git is available in the standard system repository:
\`\`\`bash
sudo apt-get install git
\`\`\`

## Mac
Download GitHub for Mac at [https://mac.github.com](https://mac.github.com) or use Homebrew: \`brew install git\`.

*(Verify installation by running \`git --version\` in your terminal)*

---

# How to Configure Git

Configuring Git involves setting up your identity (your name and email), customizing Git options, and configuring your remote repositories. Git has three levels of configuration:

1. **System Configuration (\`--system\`)**: Affects all users on your computer (stored in \`/etc/gitconfig\`).
2. **Global Configuration (\`--global\`)**: Specific to your user account and applies to all Git repositories on your computer.
3. **Repository Configuration**: Specific to a single project.

### Common Setup Commands

Set your name and email (identifiable for credit when reviewing version history):
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

Set automatic command line coloring for Git for easy reviewing:
\`\`\`bash
git config --global color.ui auto
\`\`\`

View your current configuration:
\`\`\`bash
git config --global --list
\`\`\`
    `
  },
  {
    id: 'branching-strategies',
    title: 'Branching Strategies: GitFlow vs Trunk-based',
    description: 'Explore enterprise branching strategies, from the rigid GitFlow model to modern Trunk-Based Development.',
    readTime: '6 min',
    illustrationId: 'branching',
    relatedCommands: ['git branch', 'git checkout', 'git merge'],
    relatedConcepts: ['intro-to-git'],
    relatedScenarios: ['branching', 'hotfix', 'merge-conflicts'],
    markdownContent: `
# Branching Strategies: Enterprise Workflows

A Git repository without a branching strategy is a ticking time bomb. As soon as three or more developers start pushing code, chaos ensues. Production gets broken, features are released prematurely, and merge conflicts become a daily nightmare.

To prevent this, engineering organizations adopt **Branching Strategies**. Let's explore the two most dominant strategies in the industry.

## 1. GitFlow

GitFlow is a strict, structured branching model designed for projects with scheduled release cycles (e.g., desktop software, mobile apps where you deploy version 1.0, wait a month, then deploy version 1.1).

**The Branches:**
- \`main\`: Stores the official, perfectly stable release history. Every commit on \`main\` is a production release and is usually tagged (e.g., \`v1.0.0\`).
- \`develop\`: The integration branch. All features merge here. It contains the code for the *next* upcoming release.
- \`feature/*\`: Short-lived branches spawned from \`develop\` to build new features.
- \`release/*\`: Spawned from \`develop\` when a release is imminent. Used strictly for bug fixes and version bumping before merging into both \`main\` and \`develop\`.
- \`hotfix/*\`: Spawned directly from \`main\` to fix critical production bugs immediately, bypassing the normal release cycle.

**Pros:** Highly structured, extremely safe for strict release cycles.
**Cons:** Overkill for modern web apps. The separation of \`main\` and \`develop\` often leads to "merge hell" when features sit on \`develop\` for too long.

## 2. Trunk-Based Development (TBD)

TBD is the modern standard for web applications and SaaS companies practicing Continuous Integration and Continuous Deployment (CI/CD). 

**The Branches:**
- \`main\` (The Trunk): The single source of truth. It is always deployable.
- \`feature/*\`: Extremely short-lived branches (hours, maybe 1-2 days max).

In TBD, developers merge their code into \`main\` multiple times a day.

Wait, how do you merge unfinished features into \`main\` multiple times a day without breaking production? 
**Feature Flags**. You merge the code, but you wrap it in an \`if (featureEnabled)\` toggle. 

**Pros:** Eliminates merge conflicts (because code never drifts far from \`main\`), enables rapid iteration and daily deployments.
**Cons:** Requires high discipline, automated testing, and robust feature flag infrastructure.

## Which should you use?

If you are building a web app or an API that deploys to the cloud constantly: **Use Trunk-Based Development.**
If you are building a video game, an iOS app, or medical device software with strict versioned release cycles: **Use GitFlow.**
  `
  },
  {
    id: 'remotes-prs',
    title: 'Distributed Workflows & Pull Requests',
    description: 'Understand how decentralized teams collaborate using remotes, forks, and Pull Requests.',
    readTime: '5 min',
    illustrationId: 'remotes',
    relatedCommands: ['git remote', 'git fetch', 'git pull', 'git push'],
    relatedConcepts: ['vcs-explained'],
    relatedScenarios: ['remote-operations', 'git-fetch-rebase'],
    markdownContent: `
# The Distributed Nature of Git

Unlike centralized systems, Git allows every developer to have a full, offline copy of the repository. We use **Remotes** to sync these copies.

A remote is simply a URL pointing to another copy of the repository (usually hosted on GitHub, GitLab, or Bitbucket). By convention, the primary remote is named \`origin\`.

## The Integration Manager Workflow

Most enterprise teams use an Integration Manager workflow:
1. There is a blessed, "official" repository.
2. Developers clone this repository (or fork it).
3. They push their changes to their own public clone or a specific branch on the main remote.
4. They open a **Pull Request (PR)** or Merge Request.
5. An integration manager (or peer reviewers) reviews the PR, runs automated CI checks, and merges the code into the official repository.

## Pull Requests (PRs)

A Pull Request is not a native Git feature; it is a feature of hosting platforms like GitHub. It is a request for the maintainers of a repository to "pull" your changes into their branch.

**Best Practices for PRs:**
- Keep them small and focused on a single task.
- Provide a clear description and testing instructions.
- Ensure all CI/CD pipelines (tests, linters) pass before requesting review.
    `
  },
  {
    id: 'detached-head-reflog',
    title: 'Advanced History: Detached HEAD & Reflog',
    description: 'Master time travel in Git and learn how to recover "lost" commits using the reflog.',
    readTime: '5 min',
    illustrationId: 'reflog',
    relatedCommands: ['git checkout', 'git reflog', 'git reset'],
    relatedConcepts: ['intro-to-git'],
    relatedScenarios: ['timetravel', 'reset', 'git-revert', 'git-history'],
    markdownContent: `
# The HEAD Pointer

In Git, \`HEAD\` is a special pointer that indicates your current working directory. Normally, \`HEAD\` points to a branch name (like \`main\`), and that branch points to a specific commit.

## Detached HEAD State

When you checkout a specific commit hash (e.g., \`git checkout a1b2c3d\`) instead of a branch name, you enter a **Detached HEAD** state. 

This means \`HEAD\` is pointing directly to a commit, not a branch.
- You can look around, compile, and test the old code.
- If you make new commits here, they won't belong to any branch.
- If you checkout another branch, those new commits will be "orphaned" and eventually garbage-collected by Git!

> [!TIP]
> If you want to save changes made in a detached HEAD state, simply create a new branch right there: \`git checkout -b my-rescued-work\`.

---

# The Reflog: Git's Safety Net

Git's greatest secret is that **it rarely deletes anything immediately.** 

The Reference Logs (\`reflog\`) record every time the tip of a branch (or HEAD) is updated in your local repository. If you accidentally delete a branch or do a hard reset and lose work, the reflog is your safety net.

\`\`\`bash
$ git reflog
1a410ef (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
ab1afef HEAD@{1}: commit: Add new experimental feature
...
\`\`\`

If you realize you shouldn't have reset, you can simply reset *back* to the lost commit hash found in the reflog:
\`\`\`bash
git reset --hard ab1afef
\`\`\`
    `
  },
  {
    id: 'rebase-vs-merge',
    title: 'Rebase vs. Merge',
    description: 'The age-old debate: understand when to merge and when to rebase for a clean project history.',
    readTime: '6 min',
    illustrationId: 'rebase',
    relatedCommands: ['git merge', 'git rebase'],
    relatedConcepts: ['branching-strategies'],
    relatedScenarios: ['rebase', 'git-stash', 'git-squash'],
    markdownContent: `
# Rebase vs. Merge: The Great Debate

When it comes to integrating changes from one branch into another, Git provides two primary commands: \`git merge\` and \`git rebase\`. 

Both commands achieve the exact same end goal (combining code), but they do it in fundamentally different ways, resulting in entirely different repository histories. Understanding the difference is critical for working in enterprise environments.

## 1. Git Merge: The Preserver of History

When you run \`git merge feature\` while on the \`main\` branch, Git finds the common ancestor between the two branches, and creates a brand new **Merge Commit**.

This new commit has *two parents*. It ties the two histories together.

**The Pros:**
- **Non-destructive:** Merging does not change existing history in any way. It is the safest operation in Git.
- **Contextual:** It preserves the exact chronological history of when features were developed and when they were merged.

**The Cons:**
- **Cluttered History:** If your team merges frequently, your \`git log\` will be littered with "Merge branch X into Y" commits, making the history look like a messy spider web and making it very difficult to understand what actual code changes happened.

## 2. Git Rebase: The History Rewriter

When you run \`git rebase main\` while on the \`feature\` branch, Git takes your feature branch commits, temporarily sets them aside, updates your branch pointer to match the tip of \`main\`, and then **re-applies your commits one by one on top of the new base.**

Because the base has changed, the SHA-1 hashes of your commits are completely recalculated. You are literally rewriting history.

**The Pros:**
- **Linear History:** Your project history remains a perfectly straight, linear line without any merge commits. This makes reading the \`git log\` a breeze and makes \`git bisect\` highly effective.
- **Clean PRs:** Before opening a Pull Request, rebasing your feature branch against the latest \`main\` ensures there are no conflicts and the reviewer can easily read your commits in order.

**The Cons:**
- **Destructive:** Because hashes change, if you rebase a branch that someone else is also working on, their Git history will completely detach from yours, causing catastrophic synchronization issues.

## The Golden Rule of Rebasing

> [!WARNING]
> **Never rebase commits that have been pushed to a shared public repository.**

If you follow this rule, you get all the benefits of a clean history without the synchronization nightmares. 
Use Rebase to clean up your local, private branches before pushing them. Use Merge to combine finished public branches.
  `
  },
  {
    id: 'git-hooks',
    title: 'DevOps Automation: Git Hooks',
    description: 'Automate tasks, enforce code quality, and trigger CI/CD pipelines using Git Hooks.',
    readTime: '4 min',
    illustrationId: 'hooks',
    relatedCommands: ['git commit', 'git push'],
    relatedConcepts: [],
    markdownContent: `
# What are Git Hooks?

Git hooks are custom scripts that Git executes before or after events such as: commit, push, and receive. They are the backbone of local DevOps automation.

Hooks are stored in the \`.git/hooks\` directory of your repository. By default, Git populates this directory with sample shell scripts.

## Client-Side Hooks

Client-side hooks run on the developer's local machine.

- **\`pre-commit\`**: Runs before a commit is even created. Used to inspect the snapshot that's about to be committed. Perfect for running linters, code formatters, and static analysis. If the script exits non-zero, the commit is aborted.
- **\`commit-msg\`**: Runs after the commit message is entered. Used to validate that the commit message follows a specific format (e.g., Conventional Commits).
- **\`pre-push\`**: Runs before code is pushed to a remote. Great for running local unit tests to ensure you don't push broken code.

## Server-Side Hooks

Server-side hooks run on the remote repository server (like a self-hosted Git server).

- **\`pre-receive\`**: Runs when the server receives a push, before any references are updated. Used to enforce access controls or reject non-fast-forward pushes.
- **\`post-receive\`**: Runs after the push is completed. Traditionally used to trigger CI/CD pipelines, notify chat channels, or deploy code to production.

> [!TIP]
> Because the \`.git/hooks\` directory is not tracked by Git, teams usually use tools like **Husky** (Node.js) or **pre-commit** (Python) to automatically configure local hooks for all developers when they install project dependencies.
    `
  },
  {
    id: 'git-submodules',
    title: 'Monorepos & Microservices: Submodules',
    description: 'Learn how to nest Git repositories inside other Git repositories using Submodules.',
    readTime: '4 min',
    illustrationId: 'submodules',
    relatedCommands: ['git submodule'],
    relatedConcepts: [],
    markdownContent: `
# The Microservice Problem

Often, a project needs to consume a separate, independent project (like a shared UI library or an API schema) without copying the code directly. You want to keep the projects separate, but use one within the other.

## Enter Git Submodules

Git Submodules allow you to keep a Git repository as a subdirectory of another Git repository. 

When you add a submodule, Git doesn't track the submodule's files in the parent repository. Instead, it tracks the *exact commit hash* of the submodule repository.

### Adding a Submodule

\`\`\`bash
git submodule add https://github.com/example/shared-lib.git libs/shared-lib
\`\`\`
This creates a \`.gitmodules\` file mapping the URL to the local directory.

### Cloning a Project with Submodules

If you clone a project that contains submodules, the submodule directories will be empty by default! You must initialize and update them:

\`\`\`bash
git clone https://github.com/example/main-project.git
cd main-project
git submodule init
git submodule update
\`\`\`
*(Or simply use \`git clone --recurse-submodules\`)*

> [!WARNING]
> Submodules are notorious for being tricky. When you pull changes in the parent repo, the submodule doesn't update automatically; you must run \`git submodule update\` again. For modern JavaScript or Monorepo development, package managers (like NPM Workspaces or Turborepo) are often preferred over Git submodules.
    `
  },
  {
    id: 'git-bisect',
    title: 'DevOps Debugging: Git Bisect',
    description: 'Use binary search to automatically find the exact commit that introduced a bug.',
    readTime: '3 min',
    illustrationId: 'bisect',
    relatedCommands: ['git bisect'],
    relatedConcepts: [],
    relatedScenarios: ['git-bisect-lab'],
    markdownContent: `
# Finding the Needle in the Haystack

Imagine a bug was reported in production today. The codebase worked perfectly a month ago, but since then, your team has made 500 commits. How do you find which exact commit introduced the bug?

Manually checking out and testing 500 commits would take days. 

## Git Bisect

\`git bisect\` is an advanced debugging tool that uses a binary search algorithm to find the exact commit that introduced a bug in a fraction of the time.

### The Workflow

1. Start the bisect wizard:
\`\`\`bash
git bisect start
\`\`\`

2. Tell Git that the current commit is broken (bad):
\`\`\`bash
git bisect bad
\`\`\`

3. Tell Git about an older commit that you know was working perfectly (good):
\`\`\`bash
git bisect good v1.0
\`\`\`

4. **The Magic**: Git will automatically checkout a commit exactly halfway between the good and bad commits. You test the app.
   - If the bug is present, type: \`git bisect bad\`
   - If the bug is absent, type: \`git bisect good\`

5. Git will immediately halve the remaining commits and checkout the next one. It repeats this process until it isolates the exact commit that broke the code.

> [!TIP]
> You can fully automate this for CI/CD! If you have a test script that exits with \`0\` on success and \`1\` on failure, you can run:
> \`git bisect run ./test.sh\`
> Git will automatically run the script on every step and find the breaking commit in seconds!
    `
  },
  {
    id: 'git-tools',
    title: 'Git Tools: Cherry-Picking & Tagging',
    description: 'Learn how to extract specific commits across branches and mark semantic versions.',
    readTime: '3 min',
    illustrationId: 'tools',
    relatedCommands: ['git cherry-pick', 'git tag'],
    relatedConcepts: [],
    relatedScenarios: ['git-cherry-pick', 'git-tagging'],
    markdownContent: `
# Precision Tools in Git

Sometimes, you don't want to merge an entire branch. You just need one specific bug fix or feature. 

## Cherry-Picking

\`git cherry-pick\` allows you to take a specific commit from one branch and apply a copy of it to your current branch.

**Use Cases:**
- A critical bug was fixed on the \`develop\` branch, and you need that exact fix on the \`main\` branch immediately without merging the rest of the unstable features.
- You accidentally committed something to the wrong branch.

> [!WARNING]
> Because cherry-picking creates a *duplicate* commit with a new hash, overusing it can make your project history confusing and lead to merge conflicts later. Always prefer merging or rebasing when dealing with entire feature sets.

## Tagging

Tags are immutable pointers to specific commits. Unlike branches, which move forward when you create a new commit, a tag permanently points to the exact commit it was attached to.

**Use Cases:**
- **Releases**: It is standard practice to tag commits that represent production releases (e.g., \`v1.0.0\`, \`v2.1.3\`).
- This makes it incredibly easy to checkout the exact state of the code when a specific version was released, which is vital for reproducing bugs reported by users.
    `
  },
  {
    id: 'git-interactive-staging',
    title: 'Interactive Staging',
    description: 'Stage specific lines of code instead of whole files.',
    readTime: '3 min',
    illustrationId: 'interactive-staging',
    relatedCommands: ['git add -p', 'git commit --interactive'],
    relatedConcepts: [],
    markdownContent: `
# Interactive Staging: Surgical Commits

One of the most common mistakes junior developers make is committing an entire file (\`git add .\`) when that file contains multiple, unrelated changes. For example, maybe you fixed a typo on line 5, and then added a massive experimental feature on line 100. 

If you commit both of those together, and later realize the experimental feature is broken, you cannot easily revert the feature without also reverting the typo fix!

**Enter Interactive Staging (\`git add -p\`)**

The \`-p\` (patch) flag allows you to review your changes block by block (called a "hunk") and decide individually whether each hunk should be staged for the next commit.

## Using \`git add -p\`

When you run \`git add -p filename.ts\`, Git will output a diff of the first block of changes and pause, asking you:

\`\`\`
Stage this hunk [y,n,q,a,d,/,e,?]?
\`\`\`

Here is the ultimate cheat sheet for these cryptic letters:

- \`y\`: **Yes**, stage this hunk for the next commit.
- \`n\`: **No**, do not stage this hunk (it remains modified in your working directory, but won't be in the next commit).
- \`q\`: **Quit** staging completely.
- \`a\`: Stage this hunk and **all** remaining hunks in this file.
- \`d\`: Do not stage this hunk and do not stage any of the remaining hunks in this file.
- \`s\`: **Split**. If the hunk is too large and contains multiple unrelated changes, Git will try to split it into smaller, more granular hunks.
- \`e\`: **Edit**. The most powerful option. This opens the hunk in your text editor and allows you to manually delete specific lines from the patch before staging it. This is useful when you want to stage line 1 and 3 of a new function, but leave line 2 unstaged!

## The Workflow of Professionals

By using \`git add -p\`, you can create a series of incredibly clean, atomic commits out of a messy working directory. 

1. Write code all day, making a mess.
2. Run \`git add -p\` and stage only the typo fixes.
3. Commit with a message: \`fix: resolve typo in header\`
4. Run \`git add -p\` again and stage the new feature.
5. Commit with a message: \`feat: add user authentication\`
6. Review the remaining unstaged changes and realize they are \`console.log\` statements. Discard them.

This leads to a pristine Git history that is incredibly easy for your peers to review!
  `
  },
  {
    id: 'git-advanced-search',
    title: 'Advanced Searching',
    description: 'Hunt down when and where specific code was introduced.',
    readTime: '4 min',
    illustrationId: 'advanced-search',
    relatedCommands: ['git grep', 'git log -S', 'git log -G'],
    relatedConcepts: [],
    markdownContent: `
# Advanced Searching in Git

Finding out *when* a specific variable or function was added or removed is a superpower.

## 1. Git Grep
\`git grep\` searches the working tree (or any specific commit) for a string. It is heavily optimized and incredibly fast compared to standard \`grep\`.
> \`git grep -n "function_name"\` (shows line numbers)

## 2. The Pickaxe (-S)
If you want to know *which commit* added or removed a specific string, use the "Pickaxe".
> \`git log -S "ZLIB_VERSION"\`
This will only show commits where the number of occurrences of "ZLIB_VERSION" changed (e.g., it was added or deleted).

## 3. Regular Expression Search (-G)
If your search is more complex, \`git log -G\` acts like the pickaxe but takes a regular expression.
    `
  },
  {
    id: 'git-rerere',
    title: 'Advanced Merging: Rerere',
    description: 'Reuse Recorded Resolution to never solve the same merge conflict twice.',
    readTime: '4 min',
    illustrationId: 'rerere',
    relatedCommands: ['git config --global rerere.enabled true', 'git rerere'],
    relatedConcepts: ['rebase-vs-merge'],
    markdownContent: `
# Rerere: Reuse Recorded Resolution

If you have a long-running feature branch that constantly conflicts with \`main\`, rebasing it frequently means solving the exact same merge conflicts over and over again.

**Rerere** is a hidden Git feature that solves this.

## How it works
When you enable rerere:
> \`git config --global rerere.enabled true\`

Every time you resolve a merge conflict, Git takes a snapshot of the conflict and a snapshot of your resolution. 

The next time Git sees the exact same conflict (for example, during a subsequent rebase), it will **automatically apply your previous resolution** without pausing to ask you!
    `
  },
  {
    id: 'git-config-attributes',
    title: 'Config & Attributes',
    description: 'Customize Git for your environment and project.',
    readTime: '5 min',
    illustrationId: 'config-attributes',
    relatedCommands: ['git config', 'cat .gitattributes'],
    relatedConcepts: [],
    markdownContent: `
# Customizing Git

Git can be deeply customized both globally for your machine and locally per-project.

## Git Config Levels
1. **System** (\`--system\`): Applies to all users on the OS.
2. **Global** (\`--global\`): Applies to your user account (\`~/.gitconfig\`).
3. **Local** (\`--local\`): Applies only to the current repository (\`.git/config\`).

*Example:* \`git config --global core.editor "code --wait"\` sets VSCode as the default editor for commit messages.

## Git Attributes
The \`.gitattributes\` file allows you to set specific rules for specific files or paths in your repo.
- **Line Endings:** Force Windows users to use LF line endings instead of CRLF.
  \`* text=auto eol=lf\`
- **Binary Files:** Tell Git not to try to compute diffs for images or compiled assets.
  \`*.png binary\`
- **Custom Merge Strategies:** Tell Git to always keep the local version of a specific config file during a merge.
    `
  },
  {
    id: 'git-maintenance',
    title: 'Maintenance & Data Recovery',
    description: 'Keep your repository clean and recover lost commits.',
    readTime: '4 min',
    illustrationId: 'maintenance',
    relatedCommands: ['git gc', 'git prune', 'git fsck'],
    relatedConcepts: ['detached-head-reflog'],
    markdownContent: `
# Maintenance and Data Recovery

Git rarely deletes data. Even when you delete a branch or do a hard reset, the commits still exist in the \`.git\` directory as "dangling objects".

## 1. Garbage Collection (\`git gc\`)
Over time, dangling objects and loose files can make your repository slow and bloated.
\`git gc\` cleans up unnecessary files and compresses file revisions into "packfiles" to save disk space and improve performance.

## 2. File System Check (\`git fsck\`)
If you think you've permanently lost a commit, \`git fsck --full --unreachable\` will list all objects in the database that are no longer accessible from any branch or tag. You can then use \`git show <hash>\` to inspect them and recover them if needed!
    `
  },
  {
    id: 'git-plumbing-porcelain',
    title: 'Internals: Plumbing vs Porcelain',
    description: 'Understand the difference between user commands and core operations.',
    readTime: '3 min',
    illustrationId: 'internals',
    relatedCommands: ['git hash-object', 'git update-index'],
    relatedConcepts: [],
    markdownContent: `
# Plumbing vs Porcelain

Git was originally designed as a toolkit for a version control system rather than a full user-friendly VCS. 

## Porcelain
These are the user-friendly commands you use every day: \`commit\`, \`checkout\`, \`branch\`, \`merge\`. They are called "porcelain" because they provide a nice interface over the messy plumbing.

## Plumbing
These are the low-level, core commands that do the actual work. They are designed to be chained together in scripts.
- \`git hash-object\`: Computes the SHA-1 hash of a file and stores it in the Git database.
- \`git update-index\`: Manually modifies the staging area.
- \`git write-tree\`: Creates a tree object from the staging area.

Understanding plumbing helps you realize that Git is just a simple key-value data store!
    `
  },
  {
    id: 'git-objects',
    title: 'Internals: Git Objects',
    description: 'How Git stores data: Blobs, Trees, Commits, and Tags.',
    readTime: '6 min',
    illustrationId: 'internals',
    relatedCommands: ['git cat-file -p'],
    relatedConcepts: ['git-plumbing-porcelain'],
    markdownContent: `
# Git Objects: The Core Data Store

At its absolute core, Git is not a version control system. It is a **content-addressable filesystem**. What this means is that at the heart of Git is a simple key-value data store. You hand Git some data, and it hands you back a unique key (a SHA-1 hash) you can use to retrieve that data at any point.

When you type \`git init\`, Git creates a \`.git\` directory. Inside this directory is an \`objects\` folder. This is where the magic happens.

## 1. Blobs (Binary Large Objects)
When you commit a file in Git, it does NOT store diffs (deltas) of your files initially. It stores a complete snapshot of the file's contents exactly as it exists in that moment. This snapshot is called a **Blob**.

- A blob only stores the **content** of the file. It does *not* store the file's name!
- Because Git addresses blobs by the SHA-1 hash of their contents, if you have two files with the exact same content but different names, Git will only store one blob!

Try it yourself using the plumbing command \`git hash-object\`:
\`\`\`bash
$ echo "hello world" | git hash-object -w --stdin
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
\`\`\`
Git just created a blob inside \`.git/objects/3b/\` with the remaining 38 characters as the filename.

## 2. Trees
Since blobs don't store filenames, how does Git know your project structure? It uses **Trees**.

A tree object represents a directory. It contains a list of pointers to blobs (files) and other trees (subdirectories), along with the filenames and execution permissions.

\`\`\`bash
$ git cat-file -p master^{tree}
100644 blob a906cb2a...      README.md
040000 tree 99f1a6d1...      src
\`\`\`

## 3. Commits
You have blobs for content and trees for structure. But who made the changes, and when? That's what a **Commit** object is for.

A commit object points directly to a single top-level Tree object (the state of the project). It adds metadata:
- Author name and email
- Committer name and email
- Timestamp
- Commit message
- A pointer to the parent commit(s)

\`\`\`bash
$ git cat-file -p HEAD
tree 92b8b694fc1102063fbc13b0a
parent 6271c7b8d781b2ce2132ffc
author John Doe <john@doe.com> 1623863456 -0700
committer John Doe <john@doe.com> 1623863456 -0700

Add the new login feature
\`\`\`

## 4. Tags
An annotated tag object is essentially a commit object without a tree pointer. It points to a specific commit and adds a tag message, tagger identity, and an optional GPG signature.
  `
  },
  {
    id: 'git-refspec',
    title: 'Internals: The Refspec',
    description: 'How Git maps remote branches to your local tracking branches.',
    readTime: '4 min',
    illustrationId: 'internals',
    relatedCommands: ['git fetch'],
    relatedConcepts: ['remotes-prs'],
    markdownContent: `
# The Refspec: The Mapping Engine

When you type \`git fetch\` or \`git push\`, Git has to figure out exactly how to map branches on your local machine to branches on a remote server. 

How does it know that your local \`main\` branch corresponds to the \`main\` branch on GitHub? It uses the **Refspec**.

## Where does it live?

Open your \`.git/config\` file. If you have added a remote repository (like GitHub), you will see something like this:

\`\`\`ini
[remote "origin"]
    url = https://github.com/user/repo
    fetch = +refs/heads/*:refs/remotes/origin/*
\`\`\`

The \`fetch\` line is the refspec.

## Deconstructing the Refspec

A refspec is defined with this syntax: \`+[source]:[destination]\`

Let's break down the default fetch refspec: \`+refs/heads/*:refs/remotes/origin/*\`

1. \`+\`: The plus sign tells Git to force the update, allowing non-fast-forward updates. This ensures your local tracking branches are completely overwritten by the server's state.
2. \`refs/heads/*\`: The source. This tells Git to look at all the branches (heads) on the remote server.
3. \`:\`: The separator.
4. \`refs/remotes/origin/*\`: The destination. This tells Git where to save the downloaded branches on your local machine.

In plain English, this refspec says: *"When I fetch, take every branch on the remote server, download it, and store it locally under the \`origin/\` namespace."*

## Advanced Hacks: Fetching Pull Requests

Did you know you can check out a GitHub Pull Request locally without needing the contributor to give you push access to their fork? 

GitHub stores all Pull Requests as hidden read-only branches on the server under \`refs/pull/\`.

You can modify your \`.git/config\` to automatically download all PRs whenever you fetch!
Open \`.git/config\` and add a second fetch line under origin:

\`\`\`ini
[remote "origin"]
    url = https://github.com/user/repo
    fetch = +refs/heads/*:refs/remotes/origin/*
    fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
\`\`\`

Now, when you run \`git fetch\`, Git will pull down PR #42 and store it locally as \`origin/pr/42\`. You can check it out with \`git checkout pr/42\` and test their code locally!
  `
  },
  {
    id: 'git-internals',
    title: 'Git Internals (Plumbing)',
    description: 'A deep dive into how Git stores data under the hood: Blobs, Trees, and Commits.',
    markdownContent: `# Inside the .git Directory

Most developers use Git through **Porcelain** commands (like \`git add\` and \`git commit\`). These are user-friendly commands. But under the hood, Git uses **Plumbing** commands to manipulate its internal database.

> [!IMPORTANT]
> Git is fundamentally a **Content-Addressable Filesystem**. This means the core of Git is a simple key-value data store.

## The Three Objects
When you commit something, Git stores three main types of objects:
1. **Blob**: The compressed contents of a file. (No filename or permissions, just data).
2. **Tree**: A directory listing. It maps filenames to Blobs or other Trees.
3. **Commit**: A snapshot of the root Tree, plus metadata (author, timestamp, parent commit).

## SHA-1 Hashing
Every object is assigned a 40-character checksum (SHA-1 hash). Because the hash is derived from the *content* of the file, if two files have identical content, they share the exact same Blob in the database. This makes Git incredibly space-efficient!

> [!TIP]
> Try running \`git cat-file -p HEAD\` in any repo to look under the hood at the raw commit object!`,
    readTime: '10 min',
    quiz: {
      question: 'What type of Git internal object stores the actual contents of a file?',
      options: ['Tree', 'Commit', 'Blob', 'Branch'],
      correctIndex: 2,
      explanation: 'A Blob (Binary Large Object) stores only the file data. Trees store the filenames, and Commits store the snapshot metadata.'
    }
  },
  {
    id: 'advanced-hooks',
    title: 'Git Hooks Automation',
    description: 'Learn how to automate scripts that trigger on specific Git events like committing or pushing.',
    markdownContent: `# Git Hooks

Git hooks are custom scripts that Git executes before or after events such as: commit, push, and receive. They are a built-in feature that lets you customize Git's internal behavior and trigger customizable actions at key points.

## Where do they live?
Hooks reside in the \`.git/hooks\` directory of your repository. By default, Git populates this directory with sample scripts.

## Common Hooks
* **pre-commit**: Runs before you type a commit message. It is heavily used to inspect the snapshot that's about to be committed (e.g., running linting, formatting, or tests). If this script exits non-zero, Git aborts the commit.
* **prepare-commit-msg**: Runs before the commit message editor fires up but after the default message is created. Useful for appending branch names to commit messages.
* **pre-push**: Runs during \`git push\`, after the remote refs have been updated but before any objects have been transferred. You can use it to validate that your push won't break the build.

> [!TIP]
> You can bypass pre-commit and commit-msg hooks by adding the \`--no-verify\` flag to your commit command.`,
    readTime: '6 min',
    quiz: {
      question: 'Which hook should you use to run a linter and potentially block a bad commit?',
      options: ['post-commit', 'pre-commit', 'pre-push', 'prepare-commit-msg'],
      correctIndex: 1,
      explanation: 'The pre-commit hook runs before the commit is created and can abort the process if it returns a non-zero exit code.'
    }
  },
  {
    id: 'git-submodules-advanced',
    title: 'Submodules & Monorepos',
    description: 'Strategies for managing repositories within repositories.',
    markdownContent: `# Managing Complexity: Submodules

Sometimes a project requires another project to be embedded within it. Perhaps a third-party library or an internal shared component. 

Git **Submodules** allow you to keep a Git repository as a subdirectory of another Git repository. This lets you clone another repository into your project and keep your commits separate.

## How Submodules Work
When you add a submodule (\`git submodule add <url>\`), Git does not track the *contents* of the submodule directly. Instead, it tracks a special file called \`.gitmodules\` and records the exact **commit hash** of the submodule.

> [!WARNING]
> Submodules can be notoriously tricky because pulling updates in the main repository doesn't automatically update the submodules. You often need to run \`git submodule update --init --recursive\`.

## Alternatives: Monorepos
In recent years, instead of using submodules, many massive organizations (like Google, Meta) prefer **Monorepos**, where all projects live in a single massive repository. Git struggles with truly massive repos, which is why tools like **Git LFS** and sparse-checkouts were invented.`,
    readTime: '8 min',
    quiz: {
      question: 'What exactly does the parent repository track when you add a submodule?',
      options: ['All the files inside the submodule', 'The specific commit hash of the submodule', 'Only the .gitignore file', 'The branch name of the submodule'],
      correctIndex: 1,
      explanation: 'The parent repo records a specific commit hash for the submodule, not the branch or the files, ensuring strict version locking.'
    }
  },
  {
    id: 'history-analysis',
    title: 'Advanced History Analysis',
    description: 'Learn how to filter, search, and analyze Git history like a pro.',
    readTime: '6 min',
    relatedCommands: ['git log', 'git rev-list', 'git diff'],
    markdownContent: `
# Advanced History Analysis

When debugging an issue or auditing a repository, simple \`git log\` commands often aren't enough. You need powerful tools to slice and dice the history.

## The Power of \`git log\` Flags

- \`--since="2 weeks ago"\`: Time-based filtering.
- \`--author="Linus"\`: Filter by who wrote the code.
- \`--grep="Fix #123"\`: Search within commit messages.
- \`-S"password"\`: The Pickaxe. Find the commit that introduced or removed a specific string in the codebase.
- \`--stat\`: See which files were modified and how many lines were added/removed.

> [!TIP]
> Combine these! \`git log --since="1 month ago" --author="Jane" -S"API_KEY"\` helps you find exactly when Jane modified the API key in the last month.
    `
  },
  {
    id: 'ci-cd-integrations',
    title: 'Git in CI/CD',
    description: 'How Git forms the backbone of continuous integration and continuous deployment pipelines.',
    readTime: '5 min',
    relatedCommands: ['git tag', 'git push --tags'],
    markdownContent: `
# Git in CI/CD

Continuous Integration (CI) and Continuous Deployment (CD) rely heavily on Git to trigger automated workflows.

## Push Triggers
Most modern CI/CD systems (GitHub Actions, GitLab CI, Jenkins) trigger pipelines based on Git events:
- **Push to \`main\`**: Triggers a deployment to production.
- **Push to a PR branch**: Triggers automated tests and linting.
- **Pushing a tag**: Triggers a release build.

> [!IMPORTANT]
> The \`detached HEAD\` state is very common in CI environments. The CI runner typically checks out the specific commit hash rather than a branch to ensure reproducibility.
    `
  },
  {
    id: 'monorepo-strategies',
    title: 'Monorepo Strategies',
    description: 'Managing massive codebases containing multiple projects within a single Git repository.',
    readTime: '7 min',
    relatedCommands: ['git sparse-checkout'],
    markdownContent: `
# Monorepo Strategies

A monorepo (monolithic repository) is an architectural pattern where multiple distinct projects are kept in a single version-controlled repository. Companies like Google, Meta, and Microsoft use monorepos.

## Challenges of Monorepos
As a monorepo grows, \`git clone\`, \`git status\`, and \`git fetch\` can become extremely slow because Git tracks every file in every project.

## Git Features for Monorepos
1. **Sparse Checkout**: Only check out the directories you care about, leaving the rest of the repository out of your working directory.
2. **Partial Clone (\`--filter=blob:none\`)**: Only download commit metadata. File contents are downloaded on-demand when you actually check them out.
3. **Scalar & Git FSMonitor**: Tools developed by Microsoft to make Git faster on huge repositories by utilizing background filesystem watchers.

> [!TIP]
> If you are working in a massive monorepo, always use \`git clone --filter=blob:none\` to save hours of download time.
    `
  }
];

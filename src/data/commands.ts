export type Category = 'basics' | 'branching' | 'remote' | 'history' | 'advanced';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Flag {
  flag: string;
  description: string;
}

export interface Example {
  command: string;
  explanation: string;
}

export interface GitCommand {
  name: string;
  category: Category;
  level: Level;
  synopsis: string;
  description: string;
  flags: Flag[];
  examples: Example[];
  relatedCommands: string[];
  dangers?: string;
  tip?: string;
}

export const commands: GitCommand[] = [
  {
    name: 'git init',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git init',
    description: 'Initializes a new Git repository. This creates a .git directory in the current directory, which contains all of the necessary metadata for the repository.',
    flags: [
      { flag: '--bare', description: 'Create a bare repository (no working directory).' }
    ],
    examples: [
      { command: 'git init', explanation: 'Turn the current directory into a git repository.' }
    ],
    relatedCommands: ['git clone'],
    tip: 'You only ever need to run this once per project.'
  },
  {
    name: 'git clone',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git clone <url>',
    description: 'Creates a local copy of a remote repository. It automatically sets up a remote called "origin" pointing back to the source.',
    flags: [
      { flag: '--depth <depth>', description: 'Create a shallow clone with a history truncated to the specified number of commits.' }
    ],
    examples: [
      { command: 'git clone https://github.com/user/repo.git', explanation: 'Clone the repository into a new folder named "repo".' }
    ],
    relatedCommands: ['git init', 'git fetch']
  },
  {
    name: 'git add',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git add <pathspec>',
    description: 'Adds changes from the working directory to the staging area. This tells Git you want to include these updates in the next commit.',
    flags: [
      { flag: '.', description: 'Stage all modified and new files in the current directory and subdirectories.' },
      { flag: '-p', description: 'Interactively choose chunks of changes to stage (patch mode).' }
    ],
    examples: [
      { command: 'git add index.html', explanation: 'Stage changes in index.html.' },
      { command: 'git add .', explanation: 'Stage all current changes.' }
    ],
    relatedCommands: ['git commit', 'git status'],
    tip: 'Use `git add -p` to review your changes piece by piece before committing.'
  },
  {
    name: 'git commit',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git commit -m "<message>"',
    description: 'Records the staged changes into the repository\'s history as a new snapshot (commit).',
    flags: [
      { flag: '-m', description: 'Pass the commit message directly on the command line.' },
      { flag: '-a', description: 'Automatically stage files that have been modified or deleted (skips untracked files).' },
      { flag: '--amend', description: 'Replace the last commit with a new commit, allowing you to change the message or add more staged files.' }
    ],
    examples: [
      { command: 'git commit -m "Fix login bug"', explanation: 'Commit all staged files with the message "Fix login bug".' },
      { command: 'git commit -am "Quick fix"', explanation: 'Stage all modified files and commit them instantly.' }
    ],
    relatedCommands: ['git add', 'git log'],
    dangers: 'Never use `--amend` on commits that have already been pushed to a shared remote.'
  },
  {
    name: 'git status',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git status',
    description: 'Displays the state of the working directory and the staging area. It lets you see which changes have been staged, which haven\'t, and which files aren\'t being tracked by Git.',
    flags: [
      { flag: '-s', description: 'Give the output in an abbreviated, short format.' }
    ],
    examples: [
      { command: 'git status', explanation: 'Show the comprehensive status.' }
    ],
    relatedCommands: ['git add', 'git diff']
  },
  {
    name: 'git branch',
    category: 'branching',
    level: 'beginner',
    synopsis: 'git branch <branchname>',
    description: 'List, create, or delete branches. A branch in Git is simply a lightweight movable pointer to a commit.',
    flags: [
      { flag: '-d', description: 'Delete the specified branch. This is a "safe" operation that prevents you from deleting unmerged changes.' },
      { flag: '-D', description: 'Force delete the branch, discarding unmerged changes.' },
      { flag: '-a', description: 'List both remote-tracking branches and local branches.' }
    ],
    examples: [
      { command: 'git branch', explanation: 'List all local branches.' },
      { command: 'git branch feature-x', explanation: 'Create a new branch named feature-x.' }
    ],
    relatedCommands: ['git checkout', 'git merge']
  },
  {
    name: 'git checkout',
    category: 'branching',
    level: 'beginner',
    synopsis: 'git checkout <branchname>',
    description: 'Switches branches or restores working tree files. When switching branches, it updates the files in the working directory to match the version stored in that branch, and tells Git to record all new commits on that branch.',
    flags: [
      { flag: '-b', description: 'Create a new branch and immediately switch to it.' }
    ],
    examples: [
      { command: 'git checkout main', explanation: 'Switch to the main branch.' },
      { command: 'git checkout -b fix-typo', explanation: 'Create a new branch "fix-typo" and switch to it.' },
      { command: 'git checkout -- index.html', explanation: 'Discard changes in working directory for index.html. This operation is unrecoverable.' }
    ],
    relatedCommands: ['git branch', 'git switch', 'git restore'],
    dangers: 'Checking out a specific commit hash puts you in a "detached HEAD" state.'
  },
  {
    name: 'git merge',
    category: 'branching',
    level: 'intermediate',
    synopsis: 'git merge <branch>',
    description: 'Join two or more development histories together. Incorporates changes from the named branch into the current branch.',
    flags: [
      { flag: '--no-ff', description: 'Create a merge commit even when the merge resolves as a fast-forward.' },
      { flag: '--squash', description: 'Produce the working tree and index state as if a real merge happened, but do not actually make a commit.' },
      { flag: '--abort', description: 'Abort the current conflict resolution process, and try to reconstruct the pre-merge state.' }
    ],
    examples: [
      { command: 'git merge feature-x', explanation: 'Merge feature-x into the currently checked-out branch.' }
    ],
    relatedCommands: ['git branch', 'git rebase']
  },
  {
    name: 'git rebase',
    category: 'advanced',
    level: 'advanced',
    synopsis: 'git rebase <basebranch>',
    description: 'Reapply commits on top of another base tip. It rewrites the commit history to create a clean, linear progression of commits.',
    flags: [
      { flag: '-i', description: 'Make a list of the commits which are about to be rebased. Let the user edit that list before rebasing (Interactive Rebase).' }
    ],
    examples: [
      { command: 'git rebase main', explanation: 'Rebase the current branch onto the tip of main.' },
      { command: 'git rebase -i HEAD~3', explanation: 'Interactively rebase the last 3 commits (squash, reword, drop).' }
    ],
    relatedCommands: ['git merge', 'git cherry-pick'],
    dangers: 'NEVER rebase commits that exist outside your repository and that people may have based work on (public history).'
  },
  {
    name: 'git fetch',
    category: 'remote',
    level: 'intermediate',
    synopsis: 'git fetch <remote>',
    description: 'Downloads commits, files, and refs from a remote repository into your local repo. Fetching is a safe way to see what others have done, as it does not merge the changes into your local branches.',
    flags: [
      { flag: '--all', description: 'Fetch all remotes.' },
      { flag: '--prune', description: 'Remove any remote-tracking references that no longer exist on the remote.' }
    ],
    examples: [
      { command: 'git fetch origin', explanation: 'Fetch latest changes from the remote named origin.' }
    ],
    relatedCommands: ['git pull', 'git remote']
  },
  {
    name: 'git pull',
    category: 'remote',
    level: 'intermediate',
    synopsis: 'git pull <remote> <branch>',
    description: 'Fetch from and integrate with another repository or a local branch. It is essentially a git fetch followed immediately by a git merge (or git rebase).',
    flags: [
      { flag: '--rebase', description: 'Rebase your local commits on top of the fetched branch instead of merging.' }
    ],
    examples: [
      { command: 'git pull origin main', explanation: 'Fetch the main branch from origin and merge it into your current branch.' }
    ],
    relatedCommands: ['git fetch', 'git merge', 'git push'],
    dangers: 'Because git pull immediately merges changes, it can result in unexpected merge conflicts if you have uncommitted local changes.'
  },
  {
    name: 'git push',
    category: 'remote',
    level: 'intermediate',
    synopsis: 'git push <remote> <branch>',
    description: 'Upload local repository content to a remote repository. Pushing is how you transfer commits from your local repository to a remote repo.',
    flags: [
      { flag: '-u', description: 'Set upstream tracking. Useful the first time you push a branch so subsequent pushes can just be "git push".' },
      { flag: '--force', description: 'Force the push even if it results in a non-fast-forward merge. Overwrites remote history.' },
      { flag: '--tags', description: 'Push all local tags to the remote repository.' }
    ],
    examples: [
      { command: 'git push origin main', explanation: 'Push your local main branch to the origin remote.' },
      { command: 'git push -u origin feature', explanation: 'Push the feature branch and set it to track origin/feature.' },
      { command: 'git push --tags origin', explanation: 'Transmit local branch commits and tags to the remote repository.' }
    ],
    relatedCommands: ['git pull', 'git commit', 'git remote'],
    dangers: 'Never use --force on a branch that other people are working on. You will permanently delete their work.'
  },
  {
    name: 'git config',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git config --global <key> <value>',
    description: 'Set configuration values for your Git installation. Commonly used to set the name and email address attached to your commits.',
    flags: [
      { flag: '--global', description: 'Apply the configuration to all repositories for the current user.' }
    ],
    examples: [
      { command: 'git config --global user.name "Your Name"', explanation: 'Set the author name for all your commits.' },
      { command: 'git config --global user.email "email@example.com"', explanation: 'Set the author email for all your commits.' },
      { command: 'git config --global color.ui auto', explanation: 'Set automatic command line coloring for Git for easy reviewing.' },
      { command: 'git config --global core.excludesfile [file]', explanation: 'System wide ignore pattern for all local repositories.' }
    ],
    relatedCommands: ['git init']
  },
  {
    name: 'git diff',
    category: 'basics',
    level: 'beginner',
    synopsis: 'git diff [<file>]',
    description: 'Shows the differences between the working directory and the staging area. It helps you see what you have changed but not yet staged.',
    flags: [
      { flag: '--staged', description: 'Show changes between the staging area and the last commit.' }
    ],
    examples: [
      { command: 'git diff', explanation: 'Show all unstaged changes in the working directory.' },
      { command: 'git diff --staged', explanation: 'Show all changes that have been staged for the next commit.' },
      { command: 'git diff branchB...branchA', explanation: 'Show the diff of what is in branchA that is not in branchB.' }
    ],
    relatedCommands: ['git status', 'git add', 'git commit']
  },
  {
    name: 'git rm',
    category: 'basics',
    level: 'intermediate',
    synopsis: 'git rm <file>',
    description: 'Removes files from the working directory and stages the deletion for the next commit.',
    flags: [
      { flag: '--cached', description: 'Remove the file from the staging area (stop tracking it) but keep it in the working directory.' }
    ],
    examples: [
      { command: 'git rm index.html', explanation: 'Delete index.html and stage the deletion.' }
    ],
    relatedCommands: ['git add', 'git mv']
  },
  {
    name: 'git stash',
    category: 'branching',
    level: 'intermediate',
    synopsis: 'git stash [pop|drop|list]',
    description: 'Temporarily stores modified, tracked files in order to change branches or work on something else without committing incomplete work.',
    flags: [],
    examples: [
      { command: 'git stash', explanation: 'Save modified and staged changes to the stash.' },
      { command: 'git stash pop', explanation: 'Apply the most recent stash and remove it from the stash list.' },
      { command: 'git stash list', explanation: 'List all currently stashed changes.' }
    ],
    relatedCommands: ['git checkout', 'git branch']
  },
  {
    name: 'git log',
    category: 'history',
    level: 'beginner',
    synopsis: 'git log',
    description: 'Shows the commit history for the currently active branch. Useful for inspecting what changes have been made over time.',
    flags: [
      { flag: '--oneline', description: 'Condense each commit to a single line.' },
      { flag: '--graph', description: 'Draw a text-based graphical representation of the commit history.' },
      { flag: '-n <count>', description: 'Limit the number of commits shown.' },
      { flag: '--follow [file]', description: 'Show the commits that changed file, even across renames.' },
      { flag: '--stat -M', description: 'Show all commit logs with indication of any paths that moved.' },
      { flag: '--decorate', description: 'Show reference labels like branch and tag names next to commits.' }
    ],
    examples: [
      { command: 'git log --oneline --graph --decorate', explanation: 'Show a compact visual graph with reference labels.' },
      { command: 'git log branchB..branchA', explanation: 'List commits that are present on branchA and not merged into branchB.' },
      { command: 'git log ..ref', explanation: 'List commits that are present on ref and not merged into current branch.' },
      { command: 'git log ref..', explanation: 'List commits that are present on current branch and not merged into ref.' }
    ],
    relatedCommands: ['git show', 'git status']
  },
  {
    name: 'git show',
    category: 'history',
    level: 'beginner',
    synopsis: 'git show [<commit>]',
    description: 'Shows the metadata and content changes (diff) of a specific object, typically a commit.',
    flags: [],
    examples: [
      { command: 'git show HEAD', explanation: 'Show the details and diff of the most recent commit.' }
    ],
    relatedCommands: ['git log', 'git diff']
  },
  {
    name: 'git reset',
    category: 'history',
    level: 'intermediate',
    synopsis: 'git reset [--hard|--soft] <target>',
    description: 'Switches the current branch to a specific target reference. Can be used to unstage files or completely wipe out uncommitted changes.',
    flags: [
      { flag: '--hard', description: 'Discard all working directory and staging area changes. WARNING: Data loss is possible.' },
      { flag: '--soft', description: 'Move the branch pointer but leave changes in the staging area.' }
    ],
    examples: [
      { command: 'git reset --hard HEAD~1', explanation: 'Undo the last commit and completely erase its changes from disk.' },
      { command: 'git reset HEAD <file>', explanation: 'Unstage a file while retaining the changes in the working directory.' }
    ],
    relatedCommands: ['git revert', 'git checkout'],
    dangers: 'Using --hard will permanently delete uncommitted changes in your working directory.'
  },
  {
    name: 'git revert',
    category: 'history',
    level: 'intermediate',
    synopsis: 'git revert <commit>',
    description: 'Creates a new commit that applies the exact inverse of the changes from a specified commit. This is the safest way to undo a public commit.',
    flags: [],
    examples: [
      { command: 'git revert HEAD', explanation: 'Create a new commit that undoes the changes of the very last commit.' }
    ],
    relatedCommands: ['git reset', 'git commit'],
    tip: 'Always prefer git revert over git reset for commits that have already been pushed to a remote repository.'
  },
  {
    name: 'git tag',
    category: 'history',
    level: 'beginner',
    synopsis: 'git tag [-a] <name>',
    description: 'Creates a tag reference for a specific commit. Tags are generally used to mark specific release versions (e.g., v1.0.0).',
    flags: [
      { flag: '-a', description: 'Create an annotated tag object, which contains the tagger name, email, and a message.' },
      { flag: '-d', description: 'Delete a tag.' }
    ],
    examples: [
      { command: 'git tag v1.0.0', explanation: 'Create a lightweight tag at the current commit.' },
      { command: 'git tag -a v2.0.0 -m "Release version 2"', explanation: 'Create an annotated tag.' }
    ],
    relatedCommands: ['git log', 'git push']
  },
  {
    name: 'git remote',
    category: 'remote',
    level: 'intermediate',
    synopsis: 'git remote add [alias] [url]',
    description: 'Manage the set of tracked repositories ("remotes"). Used to link your local repository to a hosted repository like GitHub.',
    flags: [],
    examples: [
      { command: 'git remote add origin https://github.com/user/repo.git', explanation: 'Add a git URL as an alias (origin).' }
    ],
    relatedCommands: ['git fetch', 'git push', 'git pull']
  },
  {
    name: 'git mv',
    category: 'basics',
    level: 'intermediate',
    synopsis: 'git mv [existing-path] [new-path]',
    description: 'Move or rename a file, a directory, or a symlink. This command safely changes the file path and immediately stages the move for the next commit.',
    flags: [],
    examples: [
      { command: 'git mv oldname.txt newname.txt', explanation: 'Rename oldname.txt to newname.txt and stage it.' }
    ],
    relatedCommands: ['git rm', 'git add']
  },
  {
    name: '.gitignore',
    category: 'basics',
    level: 'beginner',
    synopsis: '.gitignore',
    description: 'A special file that tells Git to intentionally prevent unintentional staging or committing of specified files and directories.',
    flags: [],
    examples: [
      { command: 'logs/', explanation: 'Ignore the entire logs directory.' },
      { command: '*.notes', explanation: 'Ignore all files ending in .notes.' },
      { command: 'pattern*/', explanation: 'Save a file with desired patterns as .gitignore with either direct string matches or wildcard globs.' },
      { command: '/logs/*', explanation: 'Ignore files in the logs directory, but not the directory itself.' },
      { command: '!logs/.gitkeep', explanation: 'Do NOT ignore the .gitkeep file inside the logs directory (exception).' },
      { command: '/tmp', explanation: 'Ignore the whole tmp directory.' },
      { command: '*.swp', explanation: 'Ignore all files ending with .swp.' }
    ],
    relatedCommands: ['git config', 'git status'],
    tip: 'Place the .gitignore file in the root of your repository to ignore files system-wide.'
  },
  {
    name: 'git reflog',
    category: 'history',
    level: 'intermediate',
    synopsis: 'git reflog',
    description: 'Lists the reference logs, which record every change made to the tip of branches and other references in the local repository. Highly useful for recovering lost commits.',
    flags: [],
    examples: [
      { command: 'git reflog', explanation: 'List all recent operations (like checkouts, resets, commits) on the repository.' }
    ],
    relatedCommands: ['git log', 'git reset']
  }
];

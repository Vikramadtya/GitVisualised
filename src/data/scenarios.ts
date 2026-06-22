import type { GraphState } from '../store/useScenarioStore';

export interface ScenarioStep {
  id: string;
  instructionMarkdown: string;
  expectedCommandRegex: RegExp;
  terminalOutput: string;
  resultingGraph: GraphState;
  successMessage: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  initialGraph: GraphState;
  steps: ScenarioStep[];
  relatedCommands?: string[];
}

// Helper to create empty graph
const createEmptyGraph = (): GraphState => ({
  commits: [],
  branches: [{ name: 'main', target: '' }],
  HEAD: 'main',
  stagingArea: [],
  workingDirectory: [],
  conflictedFiles: []
});

export const scenarios: Scenario[] = [
  {
    id: 'foundation',
    title: '1. The Foundation',
    description: 'Learn the core workflow of Git: modifying files, staging them, and committing them to the repository history.',
    relatedCommands: ['git add', 'git commit'],
    initialGraph: createEmptyGraph(),
    steps: [
      {
        id: 'init',
        instructionMarkdown: '### Initialize Repository\n\nTo start version tracking, we need to initialize a new Git repository. \n\n**Goal**: Type `git init`',
        expectedCommandRegex: /^git\s+init$/,
        terminalOutput: 'Initialized empty Git repository in /project/.git/',
        resultingGraph: {
          ...createEmptyGraph(),
          workingDirectory: ['index.html', 'app.js']
        },
        successMessage: 'Great! You have created a new Git repository.'
      },
      {
        id: 'add',
        instructionMarkdown: '### Stage Files\n\nYou have some new files in your working directory. Let\'s tell Git to track them by adding them to the staging area.\n\n**Goal**: Type `git add .`',
        expectedCommandRegex: /^git\s+add\s+\.$/,
        terminalOutput: '',
        resultingGraph: {
          ...createEmptyGraph(),
          stagingArea: ['index.html', 'app.js']
        },
        successMessage: 'Files are now in the Staging Area, ready to be committed.'
      },
      {
        id: 'commit',
        instructionMarkdown: '### Commit Changes\n\nNow, save a snapshot of the staging area to the repository history.\n\n**Goal**: Type `git commit -m "Initial commit"`',
        expectedCommandRegex: /^git\s+commit\s+-m\s+["'].+["']$/,
        terminalOutput: '[master (root-commit) c1a2b3c] Initial commit\n 2 files changed, 50 insertions(+)\n create mode 100644 index.html\n create mode 100644 app.js',
        resultingGraph: {
          commits: [{ id: 'c1a2b3c', parents: [], message: 'Initial commit' }],
          branches: [{ name: 'master', target: 'c1a2b3c' }],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Boom! You made your first commit. Notice the new node on the graph!'
      }
    ]
  },
  {
    id: 'branching',
    title: '2. Divergent Paths',
    description: 'Safe feature development using branches.',
    relatedCommands: ['git branch', 'git checkout', 'git merge'],
    initialGraph: {
      commits: [{ id: 'c1a2b3c', parents: [], message: 'Initial commit' }],
      branches: [{ name: 'master', target: 'c1a2b3c' }],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: []
    },
    steps: [
      {
        id: 'branch',
        instructionMarkdown: '### Create a Branch\n\nYou want to build a new auth feature. It\'s best to isolate this work.\n\n**Goal**: Type `git branch feature-auth`',
        expectedCommandRegex: /^git\s+branch\s+feature-auth$/,
        terminalOutput: '',
        resultingGraph: {
          commits: [{ id: 'c1a2b3c', parents: [], message: 'Initial commit' }],
          branches: [
            { name: 'master', target: 'c1a2b3c' },
            { name: 'feature-auth', target: 'c1a2b3c' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Branch created. Notice how the new tag points to the same commit.'
      },
      {
        id: 'checkout',
        instructionMarkdown: '### Switch Branch\n\nNow we need to actually move our HEAD pointer to the new branch so our next commits go there.\n\n**Goal**: Type `git checkout feature-auth`',
        expectedCommandRegex: /^git\s+(checkout|switch)\s+feature-auth$/,
        terminalOutput: 'Switched to branch \'feature-auth\'',
        resultingGraph: {
          commits: [{ id: 'c1a2b3c', parents: [], message: 'Initial commit' }],
          branches: [
            { name: 'master', target: 'c1a2b3c' },
            { name: 'feature-auth', target: 'c1a2b3c' }
          ],
          HEAD: 'feature-auth',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'HEAD has moved! You are now "on" the feature branch.'
      },
      {
        id: 'commit-feature',
        instructionMarkdown: '### Commit Work\n\nYou\'ve done some work. Let\'s commit it directly.\n\n**Goal**: Type `git commit -am "Add OAuth"`',
        expectedCommandRegex: /^git\s+commit\s+-a?m\s+["']Add OAuth["']$/,
        terminalOutput: '[feature-auth d4e5f6g] Add OAuth\n 1 file changed, 100 insertions(+)',
        resultingGraph: {
          commits: [
            { id: 'c1a2b3c', parents: [], message: 'Initial commit' },
            { id: 'd4e5f6g', parents: ['c1a2b3c'], message: 'Add OAuth' }
          ],
          branches: [
            { name: 'master', target: 'c1a2b3c' },
            { name: 'feature-auth', target: 'd4e5f6g' }
          ],
          HEAD: 'feature-auth',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Notice how the master branch stayed behind, but feature-auth moved forward with the new commit!'
      }
    ]
  },
  {
    id: 'hotfix',
    title: '3. The Hotfix & 3-Way Merge',
    description: 'Learn how to handle an urgent bug fix on master while you have unfinished work on a feature branch, ending with a 3-way merge.',
    relatedCommands: ['git merge', 'git checkout'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial commit' },
        { id: 'c2', parents: ['c1'], message: 'Add OAuth' }
      ],
      branches: [
        { name: 'master', target: 'c1' },
        { name: 'feature-auth', target: 'c2' }
      ],
      HEAD: 'feature-auth',
      stagingArea: [],
      workingDirectory: []
    },
    steps: [
      {
        id: 'switch-master',
        instructionMarkdown: '### Emergency!\n\nThere is a critical bug in production! We need to stop working on `feature-auth` and go back to `master` to fix it.\n\n**Goal**: Type `git checkout master`',
        expectedCommandRegex: /^git\s+(checkout|switch)\s+master$/,
        terminalOutput: 'Switched to branch \'master\'',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' }
          ],
          branches: [
            { name: 'master', target: 'c1' },
            { name: 'feature-auth', target: 'c2' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'HEAD has moved back to master.'
      },
      {
        id: 'hotfix-branch',
        instructionMarkdown: '### Create Hotfix Branch\n\nCreate a new branch for the hotfix and switch to it.\n\n**Goal**: Type `git checkout -b hotfix`',
        expectedCommandRegex: /^git\s+(checkout|switch)\s+(-b|-c)\s+hotfix$/,
        terminalOutput: 'Switched to a new branch \'hotfix\'',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' }
          ],
          branches: [
            { name: 'master', target: 'c1' },
            { name: 'feature-auth', target: 'c2' },
            { name: 'hotfix', target: 'c1' }
          ],
          HEAD: 'hotfix',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Ready to fix the bug.'
      },
      {
        id: 'hotfix-commit',
        instructionMarkdown: '### Commit Hotfix\n\nYou fixed the bug. Commit it.\n\n**Goal**: Type `git commit -am "Fix crash"`',
        expectedCommandRegex: /^git\s+commit\s+-a?m\s+["'].+["']$/,
        terminalOutput: '[hotfix c3] Fix crash\n 1 file changed, 2 insertions(+)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
            { id: 'c3', parents: ['c1'], message: 'Fix crash' }
          ],
          branches: [
            { name: 'master', target: 'c1' },
            { name: 'feature-auth', target: 'c2' },
            { name: 'hotfix', target: 'c3' }
          ],
          HEAD: 'hotfix',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Hotfix committed! Notice it diverged from feature-auth.'
      },
      {
        id: 'checkout-master-hotfix',
        instructionMarkdown: '### Switch back to Master\n\nThe hotfix is ready. Go back to master so you can merge it.\n\n**Goal**: Type `git checkout master`',
        expectedCommandRegex: /^git\s+(checkout|switch)\s+master$/,
        terminalOutput: 'Switched to branch \'master\'',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
            { id: 'c3', parents: ['c1'], message: 'Fix crash' }
          ],
          branches: [
            { name: 'master', target: 'c1' },
            { name: 'feature-auth', target: 'c2' },
            { name: 'hotfix', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'HEAD has moved back to master. You are now ready to merge.'
      },
      {
        id: 'merge-hotfix',
        instructionMarkdown: '### Merge Hotfix to Master\n\nBecause master hasn\'t moved since the hotfix branched off, this will be a **"Fast-Forward" merge**. \n\nInstead of creating a brand new merge commit node, Git simply "fast-forwards" the master pointer to sit directly on the hotfix commit.\n\n**Goal**: Type `git merge hotfix`',
        expectedCommandRegex: /^git\s+merge\s+hotfix$/,
        terminalOutput: 'Updating c1..c3\nFast-forward\n app.js | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
            { id: 'c3', parents: ['c1'], message: 'Fix crash' }
          ],
          branches: [
            { name: 'master', target: 'c3' },
            { name: 'feature-auth', target: 'c2' },
            { name: 'hotfix', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Master fast-forwarded to the hotfix commit! Notice how no new node was needed.'
      },
      {
        id: 'merge-feature',
        instructionMarkdown: '### The 3-Way Merge\n\nNow let\'s merge your feature branch into master. \n\nSince they have diverged in different directions, Git can no longer fast-forward. It is forced to create a **"Merge Commit"** (a brand new node with 2 parent arrows) to reconcile both histories!\n\n**Goal**: Type `git merge feature-auth`',
        expectedCommandRegex: /^git\s+merge\s+feature-auth$/,
        terminalOutput: 'Merge made by the \'ort\' strategy.\n index.html | 100 +++++++++\n 1 file changed, 100 insertions(+)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
            { id: 'c3', parents: ['c1'], message: 'Fix crash' },
            { id: 'c4', parents: ['c3', 'c2'], message: 'Merge branch feature-auth' }
          ],
          branches: [
            { name: 'master', target: 'c4' },
            { name: 'feature-auth', target: 'c2' },
            { name: 'hotfix', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'A 3-way merge commit was created linking both histories!'
      }
    ]
  },
  {
    id: 'timetravel',
    title: '4. Time Travel (Detached HEAD)',
    description: 'Learn how to checkout older commits to view the codebase as it existed in the past.',
    relatedCommands: ['git checkout', 'git log'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial commit' },
        { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
        { id: 'c3', parents: ['c2'], message: 'Fix bug' }
      ],
      branches: [
        { name: 'master', target: 'c3' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: []
    },
    steps: [
      {
        id: 'git-log',
        instructionMarkdown: '### View History\n\nBefore you can time travel, you need to know *where* you are traveling to! Use the log command to view the repository\'s history and find the commit ID (hash) for the "Add OAuth" commit.\n\n**Goal**: Type `git log --oneline`',
        expectedCommandRegex: /^git\s+log(\s+--oneline)?$/,
        terminalOutput: 'c3 (HEAD -> master) Fix bug\nc2 Add OAuth\nc1 Initial commit',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
            { id: 'c3', parents: ['c2'], message: 'Fix bug' }
          ],
          branches: [
            { name: 'master', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'Great! You can see that the "Add OAuth" commit has the ID `c2`.'
      },
      {
        id: 'checkout-hash',
        instructionMarkdown: '### Detached HEAD\n\nNow that you know the hash is `c2`, you can time travel directly to it. This will detach your HEAD pointer from the `master` branch and attach it directly to the old commit.\n\n**Goal**: Type `git checkout c2`',
        expectedCommandRegex: /^git\s+(checkout|switch)\s+c2$/,
        terminalOutput: 'Note: switching to \'c2\'.\n\nYou are in \'detached HEAD\' state.',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth' },
            { id: 'c3', parents: ['c2'], message: 'Fix bug' }
          ],
          branches: [
            { name: 'master', target: 'c3' }
          ],
          HEAD: 'c2',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'HEAD has detached from master and is pointing directly to an older commit!'
      }
    ]
  },
  {
    id: 'reset',
    title: '5. Undoing Mistakes (Reset)',
    description: 'Learn how to use git reset to undo commits and move your branch pointer backward.',
    relatedCommands: ['git reset'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Good commit' },
        { id: 'c2', parents: ['c1'], message: 'Bad commit' }
      ],
      branches: [
        { name: 'master', target: 'c2' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: []
    },
    steps: [
      {
        id: 'hard-reset',
        instructionMarkdown: '### Hard Reset\n\nYou realize `c2` was a terrible mistake.\n\n`git reset` allows you to forcefully move your branch pointer backwards. \n- `HEAD~1` tells Git to move back exactly **1** commit before where HEAD currently is.\n- `--hard` tells Git to completely wipe out any changes in your working directory to match that old commit.\n\n**Goal**: Type `git reset --hard HEAD~1`',
        expectedCommandRegex: /^git\s+reset\s+--hard\s+HEAD~1$/,
        terminalOutput: 'HEAD is now at c1 Good commit',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Good commit' },
            { id: 'c2', parents: ['c1'], message: 'Bad commit' }
          ],
          branches: [
            { name: 'master', target: 'c1' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'The master branch was moved back! Notice how the bad commit wasn\'t technically deleted immediately, but it is now "dangling" (greyed out) because no branch points to it anymore.'
      }
    ]
  },
  {
    id: 'rebase',
    title: '6. The Art of Rebasing',
    description: 'Learn how to rebase your feature branch onto master for a clean, linear project history.',
    relatedCommands: ['git rebase'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial' },
        { id: 'c2', parents: ['c1'], message: 'Feature A' },
        { id: 'c3', parents: ['c1'], message: 'Master update' }
      ],
      branches: [
        { name: 'master', target: 'c3' },
        { name: 'feature', target: 'c2' }
      ],
      HEAD: 'feature',
      stagingArea: [],
      workingDirectory: []
    },
    steps: [
      {
        id: 'rebase-cmd',
        instructionMarkdown: '### Rebase onto Master\n\nInstead of a 3-way merge, let\'s pick up the `feature` commit and plop it on top of `master`.\n\n**Goal**: Type `git rebase master`',
        expectedCommandRegex: /^git\s+rebase\s+master$/,
        terminalOutput: 'Successfully rebased and updated refs/heads/feature.',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial' },
            { id: 'c3', parents: ['c1'], message: 'Master update' },
            { id: 'c2_prime', parents: ['c3'], message: 'Feature A' }
          ],
          branches: [
            { name: 'master', target: 'c3' },
            { name: 'feature', target: 'c2_prime' }
          ],
          HEAD: 'feature',
          stagingArea: [],
          workingDirectory: []
        },
        successMessage: 'The history was rewritten linearly!'
      }
    ]
  },
  {
    id: 'remote-operations',
    title: '7. Remote Operations',
    description: 'Learn how to interact with remote repositories using clone, pull, and push.',
    relatedCommands: ['git clone', 'git pull', 'git push'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial commit', zone: 'remote' },
        { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'remote' }
      ],
      branches: [
        { name: 'origin/master', target: 'c2' }
      ],
      HEAD: '',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'git-clone',
        instructionMarkdown: '### Clone the Repository\n\nThere is a remote repository on GitHub with some commits. To start working on it, you need to pull it down to your local machine.\n\n**Goal**: Type `git clone https://github.com/demo/repo.git`',
        expectedCommandRegex: /^git\s+clone\s+https:\/\/github\.com\/demo\/repo\.git$/,
        terminalOutput: 'Cloning into \'repo\'...\nremote: Enumerating objects: 6, done.\nremote: Counting objects: 100% (6/6), done.\nremote: Total 6 (delta 0), reused 0 (delta 0), pack-reused 0\nReceiving objects: 100% (6/6), done.',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'local' },
            { id: 'c1_r', parents: [], message: 'Initial commit', zone: 'remote' },
            { id: 'c2_r', parents: ['c1_r'], message: 'Add OAuth', zone: 'remote' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'origin/master', target: 'c2_r' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Repository cloned! You now have a local master branch tracking origin/master.'
      },
      {
        id: 'git-fetch',
        instructionMarkdown: '### Fetch Updates\n\nSomeone else pushed a new commit to the remote repository. Let\'s fetch their changes to see them locally.\n\n**Goal**: Type `git fetch origin`',
        expectedCommandRegex: /^git\s+fetch(\s+origin)?$/,
        terminalOutput: 'remote: Enumerating objects: 4, done.\nUnpacking objects: 100% (4/4), done.\nFrom https://github.com/demo/repo\n   c2..c3  master     -> origin/master',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'local' },
            { id: 'c1_r', parents: [], message: 'Initial commit', zone: 'remote' },
            { id: 'c2_r', parents: ['c1_r'], message: 'Add OAuth', zone: 'remote' },
            { id: 'c3_r', parents: ['c2_r'], message: 'Fix typo', zone: 'remote' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'origin/master', target: 'c3_r' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Notice how origin/master moved forward on the remote graph, but your local master stayed behind!'
      },
      {
        id: 'git-pull',
        instructionMarkdown: '### Pull Changes\n\nNow let\'s actually integrate that fetched commit into your local master branch.\n\n**Goal**: Type `git pull origin master`',
        expectedCommandRegex: /^git\s+pull(\s+origin\s+master)?$/,
        terminalOutput: 'Updating c2..c3\nFast-forward\n readme.md | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Fix typo', zone: 'local' },
            { id: 'c1_r', parents: [], message: 'Initial commit', zone: 'remote' },
            { id: 'c2_r', parents: ['c1_r'], message: 'Add OAuth', zone: 'remote' },
            { id: 'c3_r', parents: ['c2_r'], message: 'Fix typo', zone: 'remote' }
          ],
          branches: [
            { name: 'master', target: 'c3' },
            { name: 'origin/master', target: 'c3_r' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Fast-forward complete. Your local master is now in sync with origin/master.'
      },
      {
        id: 'git-commit-local',
        instructionMarkdown: '### Make a Local Commit\n\nYou do some work and commit it locally.\n\n**Goal**: Type `git commit -am "My feature"`',
        expectedCommandRegex: /^git\s+commit\s+-a?m\s+["'].+["']$/,
        terminalOutput: '[master c4] My feature\n 1 file changed, 10 insertions(+)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Fix typo', zone: 'local' },
            { id: 'c4', parents: ['c3'], message: 'My feature', zone: 'local' },
            { id: 'c1_r', parents: [], message: 'Initial commit', zone: 'remote' },
            { id: 'c2_r', parents: ['c1_r'], message: 'Add OAuth', zone: 'remote' },
            { id: 'c3_r', parents: ['c2_r'], message: 'Fix typo', zone: 'remote' }
          ],
          branches: [
            { name: 'master', target: 'c4' },
            { name: 'origin/master', target: 'c3_r' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Your local master is now one commit ahead of the remote.'
      },
      {
        id: 'git-push',
        instructionMarkdown: '### Push to Remote\n\nShare your new commit with the rest of the team by pushing it to GitHub.\n\n**Goal**: Type `git push origin master`',
        expectedCommandRegex: /^git\s+push(\s+origin\s+master)?$/,
        terminalOutput: 'Enumerating objects: 5, done.\nWriting objects: 100% (3/3), 300 bytes | 300.00 KiB/s, done.\nTo https://github.com/demo/repo.git\n   c3..c4  master -> master',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Fix typo', zone: 'local' },
            { id: 'c4', parents: ['c3'], message: 'My feature', zone: 'local' },
            { id: 'c1_r', parents: [], message: 'Initial commit', zone: 'remote' },
            { id: 'c2_r', parents: ['c1_r'], message: 'Add OAuth', zone: 'remote' },
            { id: 'c3_r', parents: ['c2_r'], message: 'Fix typo', zone: 'remote' },
            { id: 'c4_r', parents: ['c3_r'], message: 'My feature', zone: 'remote' }
          ],
          branches: [
            { name: 'master', target: 'c4' },
            { name: 'origin/master', target: 'c4_r' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Pushed! The remote repository now has your commit.'
      }
    ]
  },
  {
    id: 'merge-conflicts',
    title: '8. Surviving Merge Conflicts',
    description: 'Learn how to resolve merge conflicts when two branches modify the same file.',
    relatedCommands: ['git merge', 'git status'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Update title', zone: 'local' },
        { id: 'c3', parents: ['c1'], message: 'Change title', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c2' },
        { name: 'feature', target: 'c3' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'conflict-merge',
        instructionMarkdown: '### The Conflict\n\nYou and your teammate both edited the exact same line in `index.html`. You are on `master` and want to merge `feature`.\n\n**Goal**: Type `git merge feature`',
        expectedCommandRegex: /^git\s+merge\s+feature$/,
        terminalOutput: 'Auto-merging index.html\nCONFLICT (content): Merge conflict in index.html\nAutomatic merge failed; fix conflicts and then commit the result.',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Update title', zone: 'local' },
            { id: 'c3', parents: ['c1'], message: 'Change title', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'feature', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: ['index.html']
        },
        successMessage: 'Oh no! Git stopped the merge. Notice how index.html is now in a conflicted state.'
      },
      {
        id: 'conflict-add',
        instructionMarkdown: '### Mark as Resolved\n\nYou open your editor, fix the conflict by keeping the correct title, and save the file. Now you must tell Git it is resolved.\n\n**Goal**: Type `git add index.html`',
        expectedCommandRegex: /^git\s+add\s+(index\.html|\.)$/,
        terminalOutput: '',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Update title', zone: 'local' },
            { id: 'c3', parents: ['c1'], message: 'Change title', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'feature', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: ['index.html'],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Perfect. By staging the file, Git now knows the conflict is resolved.'
      },
      {
        id: 'conflict-commit',
        instructionMarkdown: '### Finalize Merge\n\nComplete the merge by making the merge commit.\n\n**Goal**: Type `git commit`',
        expectedCommandRegex: /^git\s+commit(-m\s+["'].+["'])?$/,
        terminalOutput: '[master c4] Merge branch \'feature\'\n',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Update title', zone: 'local' },
            { id: 'c3', parents: ['c1'], message: 'Change title', zone: 'local' },
            { id: 'c4', parents: ['c2', 'c3'], message: 'Merge branch feature', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c4' },
            { name: 'feature', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Conflict resolved and successfully merged!'
      }
    ]
  },
  {
    id: 'git-stash',
    title: '9. Context Switching (Stash)',
    description: 'Learn how to safely save messy, uncommitted changes so you can switch branches without losing work.',
    relatedCommands: ['git stash'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial setup', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Add database', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c2' },
        { name: 'feature', target: 'c2' }
      ],
      HEAD: 'feature',
      stagingArea: [],
      workingDirectory: ['auth.ts', 'api.ts'],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'stash-changes',
        instructionMarkdown: '### Sudden Interruption\n\nYou are halfway through building the auth system on the `feature` branch when a P0 bug is reported on `master`. You cannot commit your messy code yet!\n\n**Goal**: Type `git stash` to safely store your uncommitted changes away.',
        expectedCommandRegex: /^git\s+stash$/,
        terminalOutput: 'Saved working directory and index state WIP on feature: c2 Add database',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add database', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'feature', target: 'c2' }
          ],
          HEAD: 'feature',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Your messy changes are safely stashed away. Your working directory is now clean!'
      },
      {
        id: 'checkout-master-bugfix',
        instructionMarkdown: '### Fix the Bug\n\nNow that your workspace is clean, switch back to master to fix the bug.\n\n**Goal**: Type `git checkout master`',
        expectedCommandRegex: /^git\s+checkout\s+master$/,
        terminalOutput: 'Switched to branch \'master\'',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add database', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'feature', target: 'c2' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'You are now on master and ready to work.'
      },
      {
        id: 'commit-hotfix',
        instructionMarkdown: '### Commit the Hotfix\n\nYou quickly fix the bug and commit it directly to master.\n\n**Goal**: Type `git commit -am "Hotfix P0 bug"`',
        expectedCommandRegex: /^git\s+commit\s+-a?m\s+["'].+["']$/,
        terminalOutput: '[master c3] Hotfix P0 bug\n 1 file changed, 2 insertions(+)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add database', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Hotfix P0 bug', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c3' },
            { name: 'feature', target: 'c2' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Bug fixed and committed to master!'
      },
      {
        id: 'checkout-feature-return',
        instructionMarkdown: '### Return to Feature\n\nBug is resolved. Time to go back to your unfinished feature.\n\n**Goal**: Type `git checkout feature`',
        expectedCommandRegex: /^git\s+checkout\s+feature$/,
        terminalOutput: 'Switched to branch \'feature\'',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add database', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Hotfix P0 bug', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c3' },
            { name: 'feature', target: 'c2' }
          ],
          HEAD: 'feature',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Back on your feature branch. But wait, where is your code?'
      },
      {
        id: 'stash-pop',
        instructionMarkdown: '### Restore Stashed Changes\n\nYour code isn\'t gone! It\'s safely stored in the stash. Let\'s pull it out and drop it from the stash list.\n\n**Goal**: Type `git stash pop`',
        expectedCommandRegex: /^git\s+stash\s+pop$/,
        terminalOutput: 'On branch feature\nChanges not staged for commit:\n  modified:   auth.ts\n  modified:   api.ts\nDropped refs/stash@{0}',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add database', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Hotfix P0 bug', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c3' },
            { name: 'feature', target: 'c2' }
          ],
          HEAD: 'feature',
          stagingArea: [],
          workingDirectory: ['auth.ts', 'api.ts'],
          conflictedFiles: []
        },
        successMessage: 'Boom! Your messy code is back exactly how you left it. You just survived a context switch like a pro.'
      }
    ]
  },
  {
    id: 'git-squash',
    title: '10. Cleaning History (Squash)',
    description: 'Learn how to use interactive rebase to squash multiple messy commits into a single, clean commit.',
    relatedCommands: ['git rebase'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'WIP: start feature', zone: 'local' },
        { id: 'c3', parents: ['c2'], message: 'WIP: fix typo', zone: 'local' },
        { id: 'c4', parents: ['c3'], message: 'WIP: tests passing', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c1' },
        { name: 'feature', target: 'c4' }
      ],
      HEAD: 'feature',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'interactive-rebase',
        instructionMarkdown: '### Squash Commits\n\nYou are ready to open a Pull Request, but reviewers will hate seeing three messy "WIP" commits. We can combine them using an interactive rebase.\n\nTo rebase the last 3 commits, you target `HEAD~3`.\n\n**Goal**: Type `git rebase -i HEAD~3`',
        expectedCommandRegex: /^git\s+rebase\s+-i\s+HEAD~3$/,
        terminalOutput: 'Successfully rebased and updated refs/heads/feature.',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
            { id: 'c5', parents: ['c1'], message: 'Complete feature', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c1' },
            { name: 'feature', target: 'c5' }
          ],
          HEAD: 'feature',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'In the background, Git opened an editor where you "squashed" the commits into one. Look at the graph: three messy commits became one beautiful commit!'
      }
    ]
  },
  {
    id: 'git-cherry-pick',
    title: '11. Cherry-Picking',
    description: 'Learn how to pick a specific commit from one branch and apply it to another.',
    relatedCommands: ['git cherry-pick'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Initial', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Add UI', zone: 'local' },
        { id: 'c3', parents: ['c2'], message: 'Add API', zone: 'local' },
        { id: 'c4', parents: ['c2'], message: 'Useful config tool', zone: 'local' },
        { id: 'c5', parents: ['c4'], message: 'Broken experiment', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c3' },
        { name: 'experiment', target: 'c5' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'cherry-pick-commit',
        instructionMarkdown: '### Pluck the Good Stuff\n\nYou are on `master`. The `experiment` branch is broken, but commit `c4` contains a "Useful config tool" that your team urgently needs on `master`.\n\nYou don\'t want to merge the broken `experiment` branch. You just want that one commit.\n\n**Goal**: Type `git cherry-pick c4`',
        expectedCommandRegex: /^git\s+cherry-pick\s+c4$/,
        terminalOutput: '[master c6] Useful config tool\n Date: Tue Jun 16 11:38:42 2026 -0400\n 1 file changed, 50 insertions(+)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Initial', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add UI', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Add API', zone: 'local' },
            { id: 'c6', parents: ['c3'], message: 'Useful config tool', zone: 'local' },
            { id: 'c4', parents: ['c2'], message: 'Useful config tool', zone: 'local' },
            { id: 'c5', parents: ['c4'], message: 'Broken experiment', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c6' },
            { name: 'experiment', target: 'c5' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Cherry-picking successfully duplicated the changes from c4 and created a brand new commit (c6) on master!'
      }
    ]
  },
  {
    id: 'git-fetch-rebase',
    title: '12. Fetch & Rebase',
    description: 'Learn how to fetch the latest changes from a remote repository and rebase your local branch onto the updated remote branch.',
    relatedCommands: ['git fetch', 'git rebase'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Init', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Feature start', zone: 'local' },
        { id: 'c3_remote', parents: ['c1'], message: 'Remote commit', zone: 'remote' }
      ],
      branches: [
        { name: 'master', target: 'c2' },
        { name: 'origin/master', target: 'c3_remote' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'fetch-origin',
        instructionMarkdown: '### Fetch Updates\n\nYour teammate pushed a new commit to `origin/master`. Fetch the latest changes without merging them yet.\n\n**Goal**: Type `git fetch origin`',
        expectedCommandRegex: /^git\s+fetch(\s+origin)?$/,
        terminalOutput: 'From https://github.com/repo\n   c1..c3_remote  master     -> origin/master',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Init', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Feature start', zone: 'local' },
            { id: 'c3', parents: ['c1'], message: 'Remote commit', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'origin/master', target: 'c3' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Successfully fetched! The remote commit is now locally available as origin/master.'
      },
      {
        id: 'rebase-origin',
        instructionMarkdown: '### Rebase Local Branch\n\nNow rebase your local `master` branch onto `origin/master` to create a clean, linear history.\n\n**Goal**: Type `git rebase origin/master`',
        expectedCommandRegex: /^git\s+rebase\s+origin\/master$/,
        terminalOutput: 'Successfully rebased and updated refs/heads/master.',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Init', zone: 'local' },
            { id: 'c3', parents: ['c1'], message: 'Remote commit', zone: 'local' },
            { id: 'c4', parents: ['c3'], message: 'Feature start', zone: 'local' }
          ],
          branches: [
            { name: 'origin/master', target: 'c3' },
            { name: 'master', target: 'c4' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Rebase complete! Your local feature is now stacked perfectly on top of the remote changes.'
      }
    ]
  },
  {
    id: 'git-tagging',
    title: '13. Tagging Releases',
    description: 'Learn how to create lightweight tags to mark specific points in your project history, like version releases.',
    relatedCommands: ['git tag'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Init', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Stable release', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c2' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'create-tag',
        instructionMarkdown: '### Mark the Release\n\nYou just finished a stable release and want to tag it as `v1.0`.\n\n**Goal**: Type `git tag v1.0`',
        expectedCommandRegex: /^git\s+tag\s+v1\.0$/,
        terminalOutput: '',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Init', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Stable release', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' },
            { name: 'v1.0 (tag)', target: 'c2' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'You created a lightweight tag! Tags act like permanent bookmarks for commits.'
      }
    ]
  },
  {
    id: 'git-revert',
    title: '14. Reverting Commits',
    description: 'Learn how to safely undo a commit by generating a new commit that provides the exact inverse of the changes.',
    relatedCommands: ['git revert'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Init', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Good feature', zone: 'local' },
        { id: 'c3', parents: ['c2'], message: 'Terrible bug', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c3' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'revert-commit',
        instructionMarkdown: '### Undo the Bug\n\nCommit `c3` introduced a terrible bug! You need to undo it, but the commit is already public so you cannot use `git reset --hard`.\n\nInstead, use `git revert HEAD` to create an inverse commit.\n\n**Goal**: Type `git revert HEAD`',
        expectedCommandRegex: /^git\s+revert\s+HEAD$/,
        terminalOutput: '[master c4] Revert "Terrible bug"\n 1 file changed, 1 deletion(-)',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Init', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Good feature', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Terrible bug', zone: 'local' },
            { id: 'c4', parents: ['c3'], message: 'Revert "Terrible bug"', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c4' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Revert complete! A new commit (c4) was created that perfectly undoes the code from c3.'
      }
    ]
  },
  {
    id: 'git-history',
    title: '15. History Analysis',
    description: 'Learn how to inspect your repository history and view the details of specific commits.',
    relatedCommands: ['git show', 'git log'],
    initialGraph: {
      commits: [
        { id: 'c1', parents: [], message: 'Setup', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Add API', zone: 'local' }
      ],
      branches: [
        { name: 'master', target: 'c2' }
      ],
      HEAD: 'master',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'show-commit',
        instructionMarkdown: '### Inspect a Commit\n\nYou want to see exactly what changed in the last commit (`HEAD`).\n\n**Goal**: Type `git show HEAD`',
        expectedCommandRegex: /^git\s+show\s+HEAD$/,
        terminalOutput: 'commit c2\nAuthor: JohnDoe <john@example.com>\nDate:   Tue Jun 16 2026\n\n    Add API\n\ndiff --git a/api.ts b/api.ts\nnew file mode 100644\n+ export const api = {}',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add API', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'git show successfully printed the commit metadata and the diff!'
      },
      {
        id: 'log-filter',
        instructionMarkdown: '### Filter History\n\nNow try to search the history for commits made by a specific author.\n\n**Goal**: Type `git log --author="JohnDoe"`',
        expectedCommandRegex: /^git\s+log\s+--author=["']?JohnDoe["']?$/,
        terminalOutput: 'commit c2\nAuthor: JohnDoe <john@example.com>\nDate:   Tue Jun 16 2026\n\n    Add API',
        resultingGraph: {
          commits: [
            { id: 'c1', parents: [], message: 'Setup', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Add API', zone: 'local' }
          ],
          branches: [
            { name: 'master', target: 'c2' }
          ],
          HEAD: 'master',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Great job! You can filter git log by author, date ranges (--since, --until), and more.'
      }
    ]
  },
  {
    id: 'git-bisect-lab',
    title: '16. Bug Hunting with Bisect',
    description: 'A bug was introduced recently, and you need to find out which commit caused it using binary search.',
    relatedCommands: ['git bisect start', 'git bisect bad', 'git bisect good'],
    initialGraph: {
      commits: [
        { id: 'v1.0', parents: [], message: 'Stable Release', zone: 'local' },
        { id: 'c1', parents: ['v1.0'], message: 'Add Feature A', zone: 'local' },
        { id: 'c2', parents: ['c1'], message: 'Refactor Auth (Introduces Bug)', zone: 'local' },
        { id: 'c3', parents: ['c2'], message: 'Add Feature B', zone: 'local' },
        { id: 'c-head', parents: ['c3'], message: 'Update Docs', zone: 'local' }
      ],
      branches: [
        { name: 'main', target: 'c-head' }
      ],
      HEAD: 'main',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'bisect-start',
        instructionMarkdown: '### Start Bisect\n\nYou are on the `main` branch and the tests are failing. You know that version `v1.0` was working fine.\nLet\'s start the bisect session.\n\n**Goal**: Type `git bisect start`',
        expectedCommandRegex: /^git\s+bisect\s+start$/,
        terminalOutput: 'status: waiting for both good and bad commits',
        resultingGraph: {
          commits: [
            { id: 'v1.0', parents: [], message: 'Stable Release', zone: 'local' },
            { id: 'c1', parents: ['v1.0'], message: 'Add Feature A', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Refactor Auth (Introduces Bug)', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Add Feature B', zone: 'local' },
            { id: 'c-head', parents: ['c3'], message: 'Update Docs', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'c-head' }
          ],
          HEAD: 'main',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Bisect started. Now you need to mark the bad and good commits.'
      },
      {
        id: 'bisect-bad',
        instructionMarkdown: '### Mark Current as Bad\n\nThe current commit (`HEAD`) is broken.\n\n**Goal**: Type `git bisect bad`',
        expectedCommandRegex: /^git\s+bisect\s+bad$/,
        terminalOutput: 'status: waiting for good commit(s), bad commit known',
        resultingGraph: {
          commits: [
            { id: 'v1.0', parents: [], message: 'Stable Release', zone: 'local' },
            { id: 'c1', parents: ['v1.0'], message: 'Add Feature A', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Refactor Auth (Introduces Bug)', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Add Feature B', zone: 'local' },
            { id: 'c-head', parents: ['c3'], message: 'Update Docs', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'c-head' }
          ],
          HEAD: 'main',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Bad commit marked.'
      },
      {
        id: 'bisect-good',
        instructionMarkdown: '### Mark a Known Good Commit\n\nYou know that the commit `v1.0` was working fine.\n\n**Goal**: Type `git bisect good v1.0`',
        expectedCommandRegex: /^git\s+bisect\s+good\s+v1\.0$/,
        terminalOutput: 'Bisecting: 1 revision left to test after this (roughly 1 step)\n[c2] Refactor Auth (Introduces Bug)',
        resultingGraph: {
          commits: [
            { id: 'v1.0', parents: [], message: 'Stable Release', zone: 'local' },
            { id: 'c1', parents: ['v1.0'], message: 'Add Feature A', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Refactor Auth (Introduces Bug)', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Add Feature B', zone: 'local' },
            { id: 'c-head', parents: ['c3'], message: 'Update Docs', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'c-head' }
          ],
          HEAD: 'c2',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Git has automatically checked out the middle commit (c2) to test!'
      },
      {
        id: 'bisect-bad-2',
        instructionMarkdown: '### Test and Mark\n\nYou run the tests on this commit (`c2`), and they fail. This commit is also bad.\n\n**Goal**: Type `git bisect bad`',
        expectedCommandRegex: /^git\s+bisect\s+bad$/,
        terminalOutput: 'Bisecting: 0 revisions left to test after this (roughly 0 steps)\n[c1] Add Feature A',
        resultingGraph: {
          commits: [
            { id: 'v1.0', parents: [], message: 'Stable Release', zone: 'local' },
            { id: 'c1', parents: ['v1.0'], message: 'Add Feature A', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Refactor Auth (Introduces Bug)', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Add Feature B', zone: 'local' },
            { id: 'c-head', parents: ['c3'], message: 'Update Docs', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'c-head' }
          ],
          HEAD: 'c1',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Git has moved halfway between v1.0 and c2 to check the final commit!'
      },
      {
        id: 'bisect-good-2',
        instructionMarkdown: '### Found it!\n\nYou run the tests on this final commit (`c1`), and they pass! This means `c2` was the first bad commit.\n\n**Goal**: Type `git bisect good`',
        expectedCommandRegex: /^git\s+bisect\s+good$/,
        terminalOutput: 'c2 is the first bad commit\ncommit c2\nAuthor: DevOps <devops@example.com>\nDate:   Tue Jun 16 2026\n\n    Refactor Auth (Introduces Bug)',
        resultingGraph: {
          commits: [
            { id: 'v1.0', parents: [], message: 'Stable Release', zone: 'local' },
            { id: 'c1', parents: ['v1.0'], message: 'Add Feature A', zone: 'local' },
            { id: 'c2', parents: ['c1'], message: 'Refactor Auth (Introduces Bug)', zone: 'local' },
            { id: 'c3', parents: ['c2'], message: 'Add Feature B', zone: 'local' },
            { id: 'c-head', parents: ['c3'], message: 'Update Docs', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'c-head' }
          ],
          HEAD: 'c1',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Boom! You successfully found the breaking commit in record time using binary search!'
      }
    ]
  },
  {
    id: 'advanced-merge-conflict',
    title: '17. Advanced Merge Conflict Resolution',
    description: 'Master resolving deep architectural merge conflicts across multiple branches without losing data.',
    relatedCommands: ['git merge', 'git status', 'git add', 'git commit'],
    initialGraph: {
      commits: [
        { id: 'base', parents: [], message: 'v1.0 Release', zone: 'local' },
        { id: 'f1', parents: ['base'], message: 'Refactor Auth Service', zone: 'local' },
        { id: 'f2', parents: ['f1'], message: 'Migrate to JWT', zone: 'local' },
        { id: 'm1', parents: ['base'], message: 'Hotfix: Auth vulnerability', zone: 'local' }
      ],
      branches: [
        { name: 'main', target: 'm1' },
        { name: 'feature/auth-refactor', target: 'f2' }
      ],
      HEAD: 'main',
      stagingArea: [],
      workingDirectory: [],
      conflictedFiles: []
    },
    steps: [
      {
        id: 'step1',
        instructionMarkdown: '### The Situation\n\nYou are on `main`. You applied a critical security hotfix to the legacy auth system. Meanwhile, a massive refactor branch (`feature/auth-refactor`) was completed.\n\n**Goal**: Attempt to merge `feature/auth-refactor` into `main`.',
        expectedCommandRegex: /^git\s+merge\s+feature\/auth-refactor$/,
        terminalOutput: 'Auto-merging src/auth.js\nCONFLICT (content): Merge conflict in src/auth.js\nAutomatic merge failed; fix conflicts and then commit the result.',
        resultingGraph: {
          commits: [
            { id: 'base', parents: [], message: 'v1.0 Release', zone: 'local' },
            { id: 'f1', parents: ['base'], message: 'Refactor Auth Service', zone: 'local' },
            { id: 'f2', parents: ['f1'], message: 'Migrate to JWT', zone: 'local' },
            { id: 'm1', parents: ['base'], message: 'Hotfix: Auth vulnerability', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'm1' },
            { name: 'feature/auth-refactor', target: 'f2' }
          ],
          HEAD: 'main',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: ['src/auth.js']
        },
        successMessage: 'Oh no! The hotfix and the refactor completely collided in `src/auth.js`. Git paused the merge.'
      },
      {
        id: 'step2',
        instructionMarkdown: '### Assessing the Damage\n\nBefore modifying files, it is crucial to see exactly what is conflicted.\n\n**Goal**: Run `git status` to view the unmerged paths.',
        expectedCommandRegex: /^git\s+status$/,
        terminalOutput: 'On branch main\nYou have unmerged paths.\n  (fix conflicts and run "git commit")\n\nUnmerged paths:\n  (use "git add <file>..." to mark resolution)\n\tboth modified:   src/auth.js',
        resultingGraph: {
          commits: [
            { id: 'base', parents: [], message: 'v1.0 Release', zone: 'local' },
            { id: 'f1', parents: ['base'], message: 'Refactor Auth Service', zone: 'local' },
            { id: 'f2', parents: ['f1'], message: 'Migrate to JWT', zone: 'local' },
            { id: 'm1', parents: ['base'], message: 'Hotfix: Auth vulnerability', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'm1' },
            { name: 'feature/auth-refactor', target: 'f2' }
          ],
          HEAD: 'main',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: ['src/auth.js']
        },
        successMessage: 'Git confirms that `src/auth.js` is the culprit.'
      },
      {
        id: 'step3',
        instructionMarkdown: '### Resolving the Conflict\n\nIn a real scenario, you would open your editor (VS Code, Vim) and manually combine the hotfix logic with the new JWT logic.\n\nAssuming you have done this, tell Git the conflict is resolved by staging the file.\n\n**Goal**: Stage the resolved file with `git add src/auth.js` (or `git add .`).',
        expectedCommandRegex: /^git\s+add\s+(src\/auth\.js|\.|-A|--all)$/,
        terminalOutput: '',
        resultingGraph: {
          commits: [
            { id: 'base', parents: [], message: 'v1.0 Release', zone: 'local' },
            { id: 'f1', parents: ['base'], message: 'Refactor Auth Service', zone: 'local' },
            { id: 'f2', parents: ['f1'], message: 'Migrate to JWT', zone: 'local' },
            { id: 'm1', parents: ['base'], message: 'Hotfix: Auth vulnerability', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'm1' },
            { name: 'feature/auth-refactor', target: 'f2' }
          ],
          HEAD: 'main',
          stagingArea: [
            'src/auth.js'
          ],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Perfect! The file is now staged, marking the conflict as resolved.'
      },
      {
        id: 'step4',
        instructionMarkdown: '### Finalizing the Merge\n\nNow that all conflicts are resolved and staged, you can complete the interrupted merge process.\n\n**Goal**: Run `git commit` to create the merge commit.',
        expectedCommandRegex: /^git\s+commit(\s+-m\s+['"].*['"])?$/,
        terminalOutput: "[main m2] Merge branch 'feature/auth-refactor'",
        resultingGraph: {
          commits: [
            { id: 'base', parents: [], message: 'v1.0 Release', zone: 'local' },
            { id: 'f1', parents: ['base'], message: 'Refactor Auth Service', zone: 'local' },
            { id: 'f2', parents: ['f1'], message: 'Migrate to JWT', zone: 'local' },
            { id: 'm1', parents: ['base'], message: 'Hotfix: Auth vulnerability', zone: 'local' },
            { id: 'm2', parents: ['m1', 'f2'], message: 'Merge feature/auth-refactor', zone: 'local' }
          ],
          branches: [
            { name: 'main', target: 'm2' },
            { name: 'feature/auth-refactor', target: 'f2' }
          ],
          HEAD: 'main',
          stagingArea: [],
          workingDirectory: [],
          conflictedFiles: []
        },
        successMessage: 'Masterful! You navigated a highly complex 3-way merge conflict like a true Senior DevOps Engineer.'
      }
    ]
  }
];

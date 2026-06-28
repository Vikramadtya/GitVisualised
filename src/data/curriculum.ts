export interface CurriculumItem {
  type: 'concept' | 'scenario';
  id: string;
}

export interface CurriculumChapter {
  id: string;
  title: string;
  description: string;
  items: CurriculumItem[];
}

export const chapters: CurriculumChapter[] = [
  {
    id: 'ch1',
    title: 'Chapter 1: The Foundation',
    description: 'Start here to learn the fundamental theories of version control and set up your environment.',
    items: [
      { type: 'concept', id: 'intro-to-git' },
      { type: 'concept', id: 'vcs-explained' },
      { type: 'concept', id: 'git-setup' },
      { type: 'concept', id: 'git-lifecycle' },
      { type: 'scenario', id: 'foundation' }
    ]
  },
  {
    id: 'ch2',
    title: 'Chapter 2: Branching Strategies',
    description: 'Learn how to isolate your work safely and explore enterprise branching models.',
    items: [
      { type: 'concept', id: 'branching-strategies' },
      { type: 'scenario', id: 'branching' },
      { type: 'scenario', id: 'hotfix' },
      { type: 'scenario', id: 'merge-conflicts' },
      { type: 'scenario', id: 'advanced-merge-conflict' }
    ]
  },
  {
    id: 'ch3',
    title: 'Chapter 3: Distributed Workflows',
    description: 'Master the art of collaborating with decentralized teams using remotes and pull requests.',
    items: [
      { type: 'concept', id: 'remotes-prs' },
      { type: 'scenario', id: 'remote-operations' },
      { type: 'scenario', id: 'git-fetch-rebase' }
    ]
  },
  {
    id: 'ch4',
    title: 'Chapter 4: Advanced History & Undoing',
    description: 'Travel through time and learn how to safely undo mistakes without losing data.',
    items: [
      { type: 'concept', id: 'detached-head-reflog' },
      { type: 'scenario', id: 'timetravel' },
      { type: 'scenario', id: 'reset' },
      { type: 'scenario', id: 'git-revert' },
      { type: 'concept', id: 'history-analysis' }
    ]
  },
  {
    id: 'ch5',
    title: 'Chapter 5: Rebasing & Context Switching',
    description: 'Rewrite history for a clean, linear project timeline and learn how to juggle multiple tasks.',
    items: [
      { type: 'concept', id: 'rebase-vs-merge' },
      { type: 'scenario', id: 'rebase' },
      { type: 'scenario', id: 'git-stash' },
      { type: 'scenario', id: 'git-squash' }
    ]
  },
  {
    id: 'ch6',
    title: 'Chapter 6: Git Tools',
    description: 'Extract specific commits and mark important releases.',
    items: [
      { type: 'concept', id: 'git-tools' },
      { type: 'scenario', id: 'git-cherry-pick' },
      { type: 'scenario', id: 'git-tagging' }
    ]
  },
  {
    id: 'ch7',
    title: 'Chapter 7: DevOps & Automation',
    description: 'The final frontier. Master the advanced tools used by DevOps engineers to automate workflows.',
    items: [
      { type: 'concept', id: 'ci-cd-integrations' },
      { type: 'concept', id: 'git-hooks' },
      { type: 'concept', id: 'git-submodules' },
      { type: 'concept', id: 'git-bisect' },
      { type: 'scenario', id: 'git-bisect-lab' }
    ]
  },
  {
    id: 'ch8',
    title: 'Chapter 8: Advanced Git Tools',
    description: 'The esoteric tools that separate seniors from masters.',
    items: [
      { type: 'concept', id: 'git-interactive-staging' },
      { type: 'scenario', id: 'interactive-staging' },
      { type: 'concept', id: 'git-advanced-search' },
      { type: 'concept', id: 'git-rerere' }
    ]
  },
  {
    id: 'ch9',
    title: 'Chapter 9: Customizing & Maintaining Git',
    description: 'Tailoring Git to your organization and keeping it healthy.',
    items: [
      { type: 'concept', id: 'git-config-attributes' },
      { type: 'concept', id: 'git-maintenance' },
      { type: 'concept', id: 'monorepo-strategies' },
      { type: 'scenario', id: 'sparse-checkout-lab' }
    ]
  },
  {
    id: 'ch10',
    title: 'Chapter 10: Git Internals',
    description: 'Peeking under the hood at the filesystem level.',
    items: [
      { type: 'concept', id: 'git-plumbing-porcelain' },
      { type: 'concept', id: 'git-objects' },
      { type: 'scenario', id: 'plumbing-lab' },
      { type: 'concept', id: 'git-refspec' }
    ]
  },
  {
    id: 'ch11',
    title: 'Chapter 11: Ultimate Mastery',
    description: 'The final boss of Git. Deep dives into binary internals, hook automation, and monorepo submodule architecture.',
    items: [
      { type: 'concept', id: 'git-internals' },
      { type: 'concept', id: 'advanced-hooks' },
      { type: 'concept', id: 'git-submodules-advanced' },
      { type: 'scenario', id: 'submodule-lab' }
    ]
  }
,
  {
    id: 'ch12',
    title: 'Chapter 12: Common Mistakes & Escape Hatches',
    description: 'A dedicated section for recovering from accidental deletions, botched rebases, and more.',
    items: [
      { type: 'concept', id: 'common-mistakes' }
    ]
  }
];
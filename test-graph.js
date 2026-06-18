const graph = {
  commits: [
    { id: 'c1', parents: [], message: 'Initial commit', zone: 'local' },
    { id: 'c2', parents: ['c1'], message: 'Add OAuth', zone: 'local' },
    { id: 'c1_r', parents: [], message: 'Initial commit', zone: 'remote' },
    { id: 'c2_r', parents: ['c1_r'], message: 'Add OAuth', zone: 'remote' },
    { id: 'c3_r', parents: ['c2_r'], message: 'Fix typo', zone: 'remote' }
  ]
};

const layout = new Map();
let currentBaseX = 0;

const roots = graph.commits.filter(c => c.parents.length === 0);
console.log('Roots found:', roots.map(r => r.id));

const visited = new Set();

roots.forEach((root) => {
  if (visited.has(root.id)) return;
  
  const queue = [];
  queue.push({ commit: root, x: currentBaseX, y: 0 });
  let treeMaxX = currentBaseX;

  while (queue.length > 0) {
    const { commit, x, y } = queue.shift();
    if (visited.has(commit.id)) continue;
    visited.add(commit.id);
    
    layout.set(commit.id, { x, y, commit });
    treeMaxX = Math.max(treeMaxX, x);

    const children = graph.commits.filter(c => c.parents.includes(commit.id));
    children.forEach((child, idx) => {
      const nextY = y + 1;
      const nextX = children.length > 1 ? x + idx : x;
      queue.push({ commit: child, x: nextX, y: nextY });
    });
  }
  
  currentBaseX = treeMaxX + 1.2;
});

const nodes = Array.from(layout.values());
console.log('Nodes array length:', nodes.length);
nodes.forEach(n => {
  console.log(`Node ${n.commit.id}: x=${n.x}, y=${n.y}`);
});

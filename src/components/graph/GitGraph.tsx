import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScenarioStore } from '../../store/useScenarioStore';
import type { GraphState, CommitNode } from '../../store/useScenarioStore';
import styles from './GitGraph.module.css';

// D3 simulation constants
const NODE_RADIUS = 14;
const LAYER_WIDTH = 200;
const LAYER_HEIGHT = 120;

interface NodePos {
  x: number;
  y: number;
  commit: CommitNode;
}

interface GitGraphProps {
  customGraph?: GraphState;
}

const GitGraph: React.FC<GitGraphProps> = ({ customGraph }) => {
  const storeGraph = useScenarioStore(state => state.graph);
  const graph = customGraph || storeGraph;

  // Basic DAG layout calculation
  // In a real app this would use D3 hierarchy or dagre, but we'll do a simple DFS for now
  const nodes = useMemo(() => {
    const layout = new Map<string, NodePos>();
    let currentBaseX = 0;
    
    // Find all roots (no parents)
    const roots = graph.commits.filter(c => c.parents.length === 0);
    if (roots.length === 0) return [];

    const visited = new Set<string>();

    roots.forEach((root) => {
      if (visited.has(root.id)) return;
      
      const queue: { commit: CommitNode, x: number, y: number }[] = [];
      queue.push({ commit: root, x: currentBaseX, y: 0 });
      let treeMaxX = currentBaseX;

      while (queue.length > 0) {
        const { commit, x, y } = queue.shift()!;
        if (visited.has(commit.id)) continue;
        visited.add(commit.id);
        
        layout.set(commit.id, { x, y, commit });
        treeMaxX = Math.max(treeMaxX, x);

        // Find children
        const children = graph.commits.filter(c => c.parents.includes(commit.id));
        children.forEach((child, idx) => {
          const nextY = y + 1;
          const nextX = children.length > 1 ? x + idx : x;
          queue.push({ commit: child, x: nextX, y: nextY });
        });
      }
      
      // Next root starts after this tree's max width
      currentBaseX = treeMaxX + 1.2;
    });

    return Array.from(layout.values());
  }, [graph.commits]);

  // Edges
  const edges = useMemo(() => {
    const links: { source: NodePos, target: NodePos, id: string }[] = [];
    nodes.forEach(node => {
      node.commit.parents.forEach(parentId => {
        const parentNode = nodes.find(n => n.commit.id === parentId);
        if (parentNode) {
          links.push({ source: parentNode, target: node, id: `${parentId}-${node.commit.id}` });
        }
      });
    });
    return links;
  }, [nodes]);

  const reachableCommits = useMemo(() => {
    const reachable = new Set<string>();
    const queue: string[] = [];
    
    graph.branches.forEach(b => queue.push(b.target));
    if (graph.commits.some(c => c.id === graph.HEAD)) {
      queue.push(graph.HEAD);
    }

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!reachable.has(currentId)) {
        reachable.add(currentId);
        const commit = graph.commits.find(c => c.id === currentId);
        if (commit) {
          commit.parents.forEach(p => queue.push(p));
        }
      }
    }
    return reachable;
  }, [graph.commits, graph.branches, graph.HEAD]);

  return (
    <div className={`${styles.graphContainer} glass-panel`}>
      <svg 
        width="100%" 
        height="100%" 
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border-focus)" />
          </marker>
        </defs>

        <g transform="translate(150, 100)">
          {/* Render Edges */}
          {edges.map(edge => {
            // Calculate curved path
            const path = `M ${edge.source.x * LAYER_WIDTH} ${edge.source.y * LAYER_HEIGHT} 
                          C ${edge.source.x * LAYER_WIDTH} ${(edge.source.y * LAYER_HEIGHT + edge.target.y * LAYER_HEIGHT) / 2},
                            ${edge.target.x * LAYER_WIDTH} ${(edge.source.y * LAYER_HEIGHT + edge.target.y * LAYER_HEIGHT) / 2},
                            ${edge.target.x * LAYER_WIDTH} ${edge.target.y * LAYER_HEIGHT}`;
            
            const isDangling = !reachableCommits.has(edge.target.commit.id);
            const isRemote = edge.target.commit.zone === 'remote';
            return (
              <motion.path
                key={edge.id}
                d={path}
                className={`${styles.edge} ${isDangling ? styles.dangling : ''} ${isRemote ? styles.remote : ''}`}
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            );
          })}

          {/* Render Nodes */}
          {nodes.map(node => {
            const isDangling = !reachableCommits.has(node.commit.id);
            return (
            <g key={node.commit.id}>
              <motion.circle
                cx={node.x * LAYER_WIDTH}
                cy={node.y * LAYER_HEIGHT}
                r={NODE_RADIUS}
                className={`${styles.node} ${isDangling ? styles.dangling : ''} ${node.commit.zone === 'remote' ? styles.remote : ''}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                layoutId={`node-${node.commit.id}`}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
              <motion.text
                x={node.x * LAYER_WIDTH}
                y={node.y * LAYER_HEIGHT + NODE_RADIUS + 20}
                className={`${styles.nodeLabel} ${isDangling ? styles.dangling : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layoutId={`label-${node.commit.id}`}
              >
                {node.commit.id.substring(0, 7)}
              </motion.text>
            </g>
            );
          })}

          {/* Render Branch Tags */}
          {(() => {
            // Group branches by target node id
            const branchesByNode = new Map<string, typeof graph.branches>();
            graph.branches.forEach(branch => {
              const arr = branchesByNode.get(branch.target) || [];
              arr.push(branch);
              branchesByNode.set(branch.target, arr);
            });

            return graph.branches.map((branch) => {
              const targetNode = nodes.find(n => n.commit.id === branch.target);
              if (!targetNode) return null;
              
              const isHead = graph.HEAD === branch.name;
              const isRemote = branch.name.startsWith('origin/');
              const fillStyle = isHead ? 'var(--color-accent-head)' : (isRemote ? 'var(--color-accent-remote)' : 'var(--color-accent-secondary)');
              const branchesOnThisNode = branchesByNode.get(branch.target) || [];
              const localIdx = branchesOnThisNode.findIndex(b => b.name === branch.name);
              
              // Estimate width based on character count
              const charWidth = 7.5;
              const padding = 24;
              const rectWidth = Math.max(60, (branch.name.length * charWidth) + padding);
              
              // Stack vertically if multiple branches point to the same node
              const xOffset = 30;
              const yOffset = -10 + (localIdx * 25);
              
              return (
                <motion.g
                  key={branch.name}
                  animate={{ 
                    x: targetNode.x * LAYER_WIDTH + xOffset, 
                    y: targetNode.y * LAYER_HEIGHT + yOffset 
                  }}
                  layoutId={`branch-${branch.name}`}
                  transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                >
                  <rect 
                    width={rectWidth} 
                    height={20} 
                    rx={10} 
                    fill={fillStyle} 
                    className={styles.branchTagBg}
                  />
                  <text x={rectWidth / 2} y={14} className={styles.branchTagText}>
                    {branch.name}
                  </text>
                </motion.g>
              );
            });
          })()}

          {/* Render HEAD Pointer */}
          {(() => {
            const headTargetBranch = graph.branches.find(b => b.name === graph.HEAD);
            let targetNode: NodePos | undefined;
            let xOffset = 30;
            let yOffset = -10;

            if (headTargetBranch) {
              // Attached HEAD
              targetNode = nodes.find(n => n.commit.id === headTargetBranch.target);
              if (!targetNode) return null;

              const branchesByNode = new Map<string, typeof graph.branches>();
              graph.branches.forEach(branch => {
                const arr = branchesByNode.get(branch.target) || [];
                arr.push(branch);
                branchesByNode.set(branch.target, arr);
              });

              const branchesOnThisNode = branchesByNode.get(headTargetBranch.target) || [];
              const localIdx = branchesOnThisNode.findIndex(b => b.name === headTargetBranch.name);
              
              const charWidth = 7.5;
              const padding = 24;
              const branchRectWidth = Math.max(60, (headTargetBranch.name.length * charWidth) + padding);

              xOffset = 30 + branchRectWidth + 8; // Sit right next to the active branch tag
              yOffset = -10 + (localIdx * 25);
            } else {
              // Detached HEAD
              targetNode = nodes.find(n => n.commit.id === graph.HEAD);
              if (!targetNode) return null;

              const branchesOnThisNode = graph.branches.filter(b => b.target === targetNode!.commit.id);
              const localIdx = branchesOnThisNode.length; // Sit below the other branch tags
              
              xOffset = 30;
              yOffset = -10 + (localIdx * 25);
            }

            return (
              <motion.g
                key="HEAD-tag"
                animate={{ 
                  x: targetNode.x * LAYER_WIDTH + xOffset, 
                  y: targetNode.y * LAYER_HEIGHT + yOffset 
                }}
                layoutId="head-tag"
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <rect 
                  width={46} 
                  height={20} 
                  rx={10} 
                  fill="var(--color-bg-base)" 
                  stroke="var(--color-accent-head)"
                  strokeWidth="1.5"
                />
                <text x={23} y={14} className={styles.branchTagText} style={{ fill: 'var(--color-accent-head)' }}>
                  HEAD
                </text>
              </motion.g>
            );
          })()}
        </g>
      </svg>

      {/* File Areas Overlay */}
      <div className={styles.fileAreas}>
        <div className={styles.areaBox}>
          <h4>Working Directory</h4>
          <div className={styles.fileList}>
            {graph.workingDirectory.map(file => (
              <motion.div 
                key={file} 
                layoutId={`file-${file}`} 
                className={styles.fileItem}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {file}
              </motion.div>
            ))}
            {graph.workingDirectory.length === 0 && <span className={styles.emptyText}>Empty</span>}
          </div>
        </div>
        
        <div className={styles.areaBox}>
          <h4>Staging Area</h4>
          <div className={styles.fileList}>
            {graph.stagingArea.map(file => (
              <motion.div 
                key={file} 
                layoutId={`file-${file}`} 
                className={`${styles.fileItem} ${styles.staged}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {file}
              </motion.div>
            ))}
            {graph.stagingArea.length === 0 && <span className={styles.emptyText}>Empty</span>}
          </div>
        </div>

        {(graph.conflictedFiles && graph.conflictedFiles.length > 0) && (
          <div className={styles.areaBox}>
            <h4 style={{ color: 'var(--color-accent-danger)' }}>Conflicted Files</h4>
            <div className={styles.fileList}>
              {graph.conflictedFiles.map(file => (
                <motion.div 
                  key={`conflict-${file}`} 
                  layoutId={`conflict-${file}`} 
                  className={`${styles.fileItem} ${styles.conflicted}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {file}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitGraph;

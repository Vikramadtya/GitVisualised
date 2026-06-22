import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScenarioStore } from '../../store/useScenarioStore';
import type { GraphState, CommitNode } from '../../store/useScenarioStore';
import styles from './GitGraph.module.css';

const NODE_RADIUS = 14;
const LAYER_WIDTH = 80;
const LAYER_HEIGHT = 80;

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

  // Compute children map once (O(N))
  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>();
    graph.commits.forEach(c => {
      c.parents.forEach(p => {
        if (!map.has(p)) map.set(p, []);
        map.get(p)!.push(c.id);
      });
    });
    return map;
  }, [graph.commits]);

  // Compute layout
  const nodes = useMemo(() => {
    if (graph.commits.length === 0) return [];

    const depths = new Map<string, number>();
    const processDepth = (id: string, depth: number) => {
      const current = depths.get(id) ?? -1;
      if (depth > current) {
        depths.set(id, depth);
        (childrenMap.get(id) || []).forEach(childId => {
           processDepth(childId, depth + 1);
        });
      }
    };

    const roots = graph.commits.filter(c => c.parents.length === 0);
    roots.forEach(root => processDepth(root.id, 0));

    if (depths.size === 0) {
      graph.commits.forEach((c, i) => depths.set(c.id, i));
    }

    const sortedCommits = [...graph.commits].sort((a, b) => (depths.get(a.id)||0) - (depths.get(b.id)||0));

    const lanes = new Map<string, number>();
    const occupied = new Set<string>();

    sortedCommits.forEach(c => {
       const y = depths.get(c.id) || 0;
       let x = 0;
       
       if (c.parents.length > 0) {
         const p1 = c.parents[0];
         x = lanes.get(p1) || 0;
       }

       while (occupied.has(`${y},${x}`)) {
         x++;
       }

       lanes.set(c.id, x);
       occupied.add(`${y},${x}`);
    });

    return sortedCommits.map(c => ({
       x: lanes.get(c.id) || 0,
       y: depths.get(c.id) || 0,
       commit: c
    }));
  }, [graph.commits, childrenMap]);

  // Compute edges
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

  // Compute reachable
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

  // ViewBox bounds
  const [viewBox, setViewBox] = useState('0 0 800 600');
  
  useEffect(() => {
    if (nodes.length === 0) return;
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    nodes.forEach(n => {
       const px = n.x * LAYER_WIDTH;
       const py = n.y * LAYER_HEIGHT;
       if (px < minX) minX = px;
       if (px > maxX) maxX = px;
       if (py < minY) minY = py;
       if (py > maxY) maxY = py;
    });
    minX -= 50;
    maxX += 200;
    minY -= 50;
    maxY += 100;
    const width = Math.max(600, maxX - minX);
    const height = Math.max(400, maxY - minY);
    setViewBox(`${minX} ${minY} ${width} ${height}`);
  }, [nodes]);

  return (
    <div className={`${styles.graphContainer} glass-panel`} style={{ cursor: 'grab', width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border-focus)" />
          </marker>
        </defs>

        <g>
          {/* Render Edges */}
          {edges.map(edge => {
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
              <title>{node.commit.message}</title>
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
                style={{ fontSize: '10px' }}
              >
                {node.commit.id.substring(0, 7)}
              </motion.text>
            </g>
            );
          })}

          {/* Render Branch Tags */}
          {(() => {
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
              
              const charWidth = 7.5;
              const padding = 24;
              const rectWidth = Math.max(60, (branch.name.length * charWidth) + padding);
              
              const xOffset = 30;
              const yOffset = -10 + (localIdx * 25);
              
              return (
                <motion.g
                  key={`branch-${branch.name}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  layoutId={`branch-${branch.name}`}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <rect 
                    x={targetNode.x * LAYER_WIDTH + xOffset} 
                    y={targetNode.y * LAYER_HEIGHT + yOffset} 
                    width={rectWidth} 
                    height={20} 
                    rx={10} 
                    fill={fillStyle} 
                  />
                  <text 
                    x={targetNode.x * LAYER_WIDTH + xOffset + (rectWidth/2)} 
                    y={targetNode.y * LAYER_HEIGHT + yOffset + 14} 
                    className={styles.branchText}
                  >
                    {branch.name}
                  </text>
                  
                  {isHead && (
                    <g>
                      <rect 
                        x={targetNode.x * LAYER_WIDTH + xOffset + rectWidth + 10} 
                        y={targetNode.y * LAYER_HEIGHT + yOffset} 
                        width={50} 
                        height={20} 
                        rx={10} 
                        fill="none"
                        stroke="var(--color-accent-head)"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <text 
                        x={targetNode.x * LAYER_WIDTH + xOffset + rectWidth + 35} 
                        y={targetNode.y * LAYER_HEIGHT + yOffset + 14} 
                        className={styles.branchText}
                        fill="var(--color-text-primary)"
                      >
                        HEAD
                      </text>
                    </g>
                  )}
                </motion.g>
              );
            });
          })()}

          {/* Render Detached HEAD if applicable */}
          {(() => {
            if (!graph.branches.some(b => b.name === graph.HEAD)) {
              // HEAD is detached, points directly to a commit
              const targetNode = nodes.find(n => n.commit.id === graph.HEAD);
              if (!targetNode) return null;

              const branchesOnThisNode = graph.branches.filter(b => b.target === graph.HEAD).length;
              const yOffset = -10 + (branchesOnThisNode * 25);

              return (
                <motion.g
                  key="detached-head"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  layoutId="detached-head"
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <rect 
                    x={targetNode.x * LAYER_WIDTH + 30} 
                    y={targetNode.y * LAYER_HEIGHT + yOffset} 
                    width={50} 
                    height={20} 
                    rx={10} 
                    fill="var(--color-accent-head)" 
                  />
                  <text 
                    x={targetNode.x * LAYER_WIDTH + 55} 
                    y={targetNode.y * LAYER_HEIGHT + yOffset + 14} 
                    className={styles.branchText}
                  >
                    HEAD
                  </text>
                </motion.g>
              );
            }
            return null;
          })()}
        </g>
      </svg>
    </div>
  );
};

export default GitGraph;

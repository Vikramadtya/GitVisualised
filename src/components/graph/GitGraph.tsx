import React, { useMemo, useState, useRef } from 'react';
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
    const processing = new Set<string>();

    const processDepth = (id: string, depth: number) => {
      if (processing.has(id)) return;
      processing.add(id);

      const current = depths.get(id) ?? -1;
      if (depth > current) {
        depths.set(id, depth);
        (childrenMap.get(id) || []).forEach(childId => {
           processDepth(childId, depth + 1);
        });
      }
      
      processing.delete(id);
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
    const nodeMap = new Map(nodes.map(n => [n.commit.id, n]));
    
    nodes.forEach(node => {
      node.commit.parents.forEach(parentId => {
        const parentNode = nodeMap.get(parentId);
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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCommit, setHoveredCommit] = useState<{ commit: CommitNode, x: number, y: number } | null>(null);
  const [selectedCommit, setSelectedCommit] = useState<CommitNode | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    setZoom(prev => Math.min(Math.max(0.3, prev + e.deltaY * 0.002), 4));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setPan(prev => ({ x: prev.x - dx / zoom, y: prev.y - dy / zoom }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const viewBox = useMemo(() => {
    if (nodes.length === 0) return "0 0 600 400";
    const minX = Math.min(...nodes.map(n => n.x * LAYER_WIDTH)) - 50;
    const maxX = Math.max(...nodes.map(n => n.x * LAYER_WIDTH)) + 200;
    const minY = Math.min(...nodes.map(n => n.y * LAYER_HEIGHT)) - 50;
    const maxY = Math.max(...nodes.map(n => n.y * LAYER_HEIGHT)) + 150;

    const width = Math.max(600, maxX - minX);
    const height = Math.max(400, maxY - minY);
    
    const zWidth = width / zoom;
    const zHeight = height / zoom;
    const zX = minX + pan.x + (width - zWidth) / 2;
    const zY = minY + pan.y + (height - zHeight) / 2;

    return `${zX} ${zY} ${zWidth} ${zHeight}`;
  }, [nodes, zoom, pan]);

  return (
    <div 
      className={`${styles.graphContainer} glass-panel`} 
      style={{ cursor: isDragging ? 'grabbing' : 'grab', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
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
                animate={{ scale: selectedCommit?.id === node.commit.id ? 1.3 : 1, opacity: 1 }}
                layoutId={`node-${node.commit.id}`}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onPointerEnter={(e) => {
                   if (!isDragging) setHoveredCommit({ commit: node.commit, x: e.clientX, y: e.clientY });
                }}
                onPointerLeave={() => setHoveredCommit(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCommit(node.commit);
                }}
                style={{ cursor: 'pointer', stroke: selectedCommit?.id === node.commit.id ? 'var(--color-accent-primary)' : undefined, strokeWidth: selectedCommit?.id === node.commit.id ? 4 : 2 }}
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
      
      {/* Tooltip */}
      {hoveredCommit && !isDragging && (
        <div style={{
          position: 'fixed',
          top: hoveredCommit.y + 15,
          left: hoveredCommit.x + 15,
          background: 'var(--color-bg-overlay)',
          border: '1px solid var(--color-border-focus)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          fontSize: '0.8rem'
        }}>
          <div style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{hoveredCommit.commit.id.substring(0, 7)}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{hoveredCommit.commit.message}</div>
          {hoveredCommit.commit.zone && <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: 4 }}>Zone: {hoveredCommit.commit.zone}</div>}
        </div>
      )}

      {/* Inspect Modal */}
      {selectedCommit && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          width: '280px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h4 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Commit {selectedCommit.id.substring(0, 7)}</h4>
            <button onClick={() => setSelectedCommit(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}>✕</button>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{selectedCommit.message}</p>
          <div style={{ fontSize: '0.8rem' }}>
            <strong>Parents:</strong> {selectedCommit.parents.length > 0 ? selectedCommit.parents.map(p => p.substring(0,7)).join(', ') : 'None (Root)'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitGraph;

let idCounter = 0;
let leafIndex = 0;

function layoutNode(node, depth, parentId, nodes, edges) {
  if (!node) return null;

  const id = String(++idCounter);
  const label = node.type || node.label || '?';
  const value = node.name || node.value || node.varType || '';

  const children = node.children || [];
  
  const flowNode = {
    id,
    type: 'astNode',
    // In horizontal layout, depth goes left-to-right (X axis), siblings stack top-to-bottom (Y axis)
    position: { x: depth * 145, y: 0 }, 
    data: { label, value },
  };
  nodes.push(flowNode);

  if (parentId) {
    edges.push({
      id: `e${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#475569', strokeWidth: 1.5 },
    });
  }

  if (children.length === 0) {
    // Leaf node: place sequentially along the Y axis with compact spacing
    flowNode.position.y = leafIndex * 65;
    leafIndex++;
  } else {
    // Parent node: layout children first, then vertically center parent between them
    const childYCoords = [];
    children.forEach(child => {
      const childY = layoutNode(child, depth + 1, id, nodes, edges);
      if (childY !== null) {
        childYCoords.push(childY);
      }
    });

    const avgY = childYCoords.reduce((a, b) => a + b, 0) / childYCoords.length;
    flowNode.position.y = avgY;
  }

  return flowNode.position.y;
}

export function astToFlow(ast) {
  idCounter = 0;
  leafIndex = 0;
  const nodes = [];
  const edges = [];
  layoutNode(ast, 0, null, nodes, edges);
  return { nodes, edges };
}

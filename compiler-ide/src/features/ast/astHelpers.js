let idCounter = 0;
let leafIndex = 0;

function layoutNode(node, depth, parentId, nodes, edges) {
  if (!node) return null;

  const id = String(++idCounter);
  const label = node.type || node.label || '?';
  const value = node.name || node.value || node.varType || '';

  const children = node.children || [];
  
  // Simulate Precision Status and Budgets
  let status = 'safe';
  const r = Math.random();
  if (r > 0.8) status = 'borderline';
  if (r > 0.95) status = 'blocked';
  
  if (label === 'Program' || label === 'FunctionDecl' || label === 'Statements' || label === 'Declarations') {
     status = 'neutral';
  }

  let errorBudget = (Math.random() * 0.05).toExponential(2);
  if (status === 'neutral') errorBudget = null;

  const flowNode = {
    id,
    type: 'astNode',
    // In horizontal layout, depth goes left-to-right (X axis), siblings stack top-to-bottom (Y axis)
    position: { x: depth * 180, y: 0 }, 
    data: { label, value, status, errorBudget, parentId },
  };
  nodes.push(flowNode);

  if (parentId) {
    edges.push({
      id: `e${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'smoothstep',
      animated: true,
      label: '', // Hidden by default, updated on hover
      data: { errorBudget }, // Store budget to display on hover
      style: { stroke: '#475569', strokeWidth: 1.5, transition: 'all 0.3s' },
      labelStyle: { fill: '#E2E8F0', fontSize: 10, fontWeight: 'bold' },
      labelBgStyle: { fill: '#111827', fillOpacity: 0.8 },
      labelBgPadding: [4, 4],
      labelBgBorderRadius: 4,
    });
  }

  if (children.length === 0) {
    // Leaf node: place sequentially along the Y axis with compact spacing
    flowNode.position.y = leafIndex * 75;
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

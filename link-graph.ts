/**
 * Builds link graph from canvas edges
 */

import { CanvasEdge, NodeMapping } from './types';

/**
 * Builds parent-child relationships from canvas edges
 */
export function buildLinkGraph(
	edges: CanvasEdge[],
	nodeMappings: Map<string, NodeMapping>
): void {
	for (const edge of edges) {
		const fromNode = nodeMappings.get(edge.fromNode);
		const toNode = nodeMappings.get(edge.toNode);
		
		if (fromNode && toNode) {
			// Add child to fromNode
			if (!fromNode.children.includes(edge.toNode)) {
				fromNode.children.push(edge.toNode);
			}
			
			// Add parent to toNode
			if (!toNode.parents.includes(edge.fromNode)) {
				toNode.parents.push(edge.fromNode);
			}
		}
	}
}

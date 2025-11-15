/**
 * Generates note content with bidirectional links
 */

import { NodeMapping } from './types';

/**
 * Generates the complete note content including parents and links sections
 */
export function generateNoteContent(
	mapping: NodeMapping,
	nodeMappings: Map<string, NodeMapping>
): string {
	const parts: string[] = [];
	
	// Add parents section
	if (mapping.parents.length > 0) {
		parts.push('## Parents');
		for (const parentId of mapping.parents) {
			const parentNode = nodeMappings.get(parentId);
			if (parentNode) {
				parts.push(`- [[${parentNode.filename}]]`);
			}
		}
		parts.push('');
	}
	
	// Add original content
	parts.push(mapping.content);
	
	// Add links section for children
	if (mapping.children.length > 0) {
		parts.push('');
		parts.push('## Child');
		for (const childId of mapping.children) {
			const childNode = nodeMappings.get(childId);
			if (childNode) {
				parts.push(`- [[${childNode.filename}]]`);
			}
		}
	}
	
	return parts.join('\n');
}

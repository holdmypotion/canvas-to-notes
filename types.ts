/**
 * Type definitions for Canvas data structures
 */

export interface CanvasData {
	nodes: CanvasNode[];
	edges: CanvasEdge[];
}

export interface CanvasNode {
	id: string;
	type: string;
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface CanvasEdge {
	id: string;
	fromNode: string;
	fromSide?: string;
	toNode: string;
	toSide?: string;
}

export interface NodeMapping {
	nodeId: string;
	filename: string;
	content: string;
	children: string[]; // Node IDs this connects to
	parents: string[];  // Node IDs that connect to this
}

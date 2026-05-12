export interface MiserablesNode {
    id: string;
    group: number;
}

export interface MiserablesLink {
    source: string;
    target: string;
    value: number;
}

export interface MiserablesPayload {
    nodes: MiserablesNode[];
    links: MiserablesLink[];
}

export interface SimNode {
    id: string;
    group: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    fx: number | null;
    fy: number | null;
}

export interface SimLink {
    source: SimNode;
    target: SimNode;
    value: number;
}

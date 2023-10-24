import { BaseConfiguration } from "../../domain/nodes";

export interface RandomRoute {
    id: string;
    name: string;
    weight: number;
    collapsed: boolean;
}

export interface IRandomNode {
    configuration: BaseConfiguration & {
        routes: RandomRoute[];
    };
}

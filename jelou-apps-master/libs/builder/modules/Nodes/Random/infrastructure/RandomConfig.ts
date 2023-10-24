import { nanoid } from "nanoid";
import { RandomRoute } from "../domain/random.domain";

export class RandomConfig {
    public static MAX_WEIGHT_ALLOWED = 100;

    public static generateNewConfig(): RandomRoute {
        return {
            id: nanoid(),
            name: "",
            weight: this.parseWeightPercentage(100),
            collapsed: false,
        };
    }

    public static getRoutesTotalWeight(routes: RandomRoute[]): number {
        const total = routes.reduce((acc, route) => acc + route.weight, 0);
        return Number(this.getWeightFromPercentage(total).toFixed(0));
    }

    public static parseWeightPercentage(weight: number): number {
        return weight / 100;
    }

    public static getWeightFromPercentage(weight: number): number {
        return weight * 100;
    }
}

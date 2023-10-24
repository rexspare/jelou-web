import { Node, useReactFlow } from "reactflow";
import { useCallback, useMemo } from "react";

import { ArrowIcon, CloseIcon } from "@builder/Icons";
import { NumberInput, TextInput } from "@builder/common/inputs";
import { IRandomNode, RandomRoute } from "@builder/modules/Nodes/Random/domain/random.domain";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { RandomConfig } from "@builder/modules/Nodes/Random/infrastructure/RandomConfig";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { Case } from "@builder/common/Headless/conditionalRendering/Switch";

type Props = {
    nodeId: string;
};

type RandomNodeInput = "name" | "weight" | "collapsed";

export const RandomConfigPanel = ({ nodeId }: Props) => {
    const node = useReactFlow().getNode(nodeId) as Node<IRandomNode>;
    const { routes = [] } = node.data.configuration;
    const { updateLocalNode } = useCustomsNodes();

    const totalRouteWeight = useMemo<number>(() => RandomConfig.getRoutesTotalWeight(routes), [routes]);

    const updateRoutes = useCallback((route: RandomRoute) => routes.map((value) => (value.id === route.id ? route : value)), [routes]);

    const saveRoutes = useCallback((updatedRoutes: RandomRoute[]) => {
        const newConfiguration = {
            configuration: {
                ...node.data.configuration,
                routes: updatedRoutes,
            },
        };

        updateLocalNode(nodeId, newConfiguration);
    }, []);

    const handleChange = (value: string | number | boolean, input: RandomNodeInput, route: RandomRoute) => {
        const updatedValues: RandomRoute = {
            ...route,
            [input]: value,
        };

        const updatedRoutes = updateRoutes(updatedValues);
        saveRoutes(updatedRoutes);
    };

    const handleDeleteRoute = (routeId: string) => {
        const updatedRoutes = routes.filter((route) => route.id !== routeId);
        saveRoutes(updatedRoutes);
    };

    const handleAddNewRoute = () => {
        const newRoute = RandomConfig.generateNewConfig();
        saveRoutes([...routes, newRoute]);
    };

    return (
        <main className="flex h-[90%] flex-col gap-y-4 overflow-y-auto border-t-1 border-gray-230 py-4 px-6 text-gray-400">
            <div className="flex flex-col gap-y-1 rounded-12 bg-[#FFFBF1] p-3 text-xs text-[#563F00]">
                <p>El total de la distribución debe ser igual al {RandomConfig.MAX_WEIGHT_ALLOWED}%</p>
                <Switch>
                    <Case condition={totalRouteWeight > RandomConfig.MAX_WEIGHT_ALLOWED}>
                        <p>El porcentaje actual es de {totalRouteWeight}%</p>
                    </Case>
                </Switch>
            </div>

            {routes.map((route, index) => (
                <RouteItem
                    key={route.id}
                    route={route}
                    defaultRouteName={`Ruta ${index + 1}`}
                    onChange={(value, input) => handleChange(value, input, route)}
                    onDeleteRoute={(routeId) => handleDeleteRoute(routeId)}
                />
            ))}

            <footer>
                <button className="flex h-8 items-center justify-center rounded-full border-1 border-primary-200 px-3 py-2 font-semibold text-primary-200" onClick={handleAddNewRoute}>
                    + Nueva ruta
                </button>
            </footer>
        </main>
    );
};

type RouteItemProps = {
    route: RandomRoute;
    defaultRouteName?: string;
    onChange?: (value: string | number | boolean, input: RandomNodeInput) => void;
    onDeleteRoute?: (routeId: string) => void;
};

const RouteItem = ({ route, defaultRouteName = "Ruta", onChange = () => null, onDeleteRoute = () => null }: RouteItemProps) => {
    return (
        <div className="flex flex-col gap-y-5 rounded-12 border-1 border-gray-330 p-4">
            <header className="flex items-center justify-between">
                <p className="flex cursor-pointer items-center gap-x-2" onClick={(_event) => onChange(!route.collapsed, "collapsed")}>
                    <ArrowIcon className={`${!route.collapsed && "-rotate-180"} transition-all duration-200 ease-linear`} height={16} width={16} />
                    {route.name || defaultRouteName}
                </p>

                <button onClick={(_event) => onDeleteRoute(route.id)}>
                    <CloseIcon width={16} height={16} />
                </button>
            </header>

            {!route.collapsed && (
                <section className="flex flex-col gap-y-4">
                    <TextInput value={route.name} defaultValue={route.name} label="Nombre de ruta" placeholder="Ej. Ruta 01" onChange={(event) => onChange(event.currentTarget.value, "name")} />
                    <NumberInput
                        name="weight"
                        label="Porcentaje"
                        defaultValue={RandomConfig.getWeightFromPercentage(route.weight).toString()}
                        labelClassName="block"
                        hasError=""
                        placeholder="Ej. 50"
                        onChange={(event) => onChange(RandomConfig.parseWeightPercentage(Number(event.currentTarget.value)), "weight")}
                    />
                </section>
            )}
        </div>
    );
};

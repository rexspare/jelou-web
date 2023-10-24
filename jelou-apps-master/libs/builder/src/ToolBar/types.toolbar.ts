export interface ToolbarActionItem {
    id: number;
    text: string;
    color: string;
    bgIcon: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    nodeType: string;
    initialData: string;
}

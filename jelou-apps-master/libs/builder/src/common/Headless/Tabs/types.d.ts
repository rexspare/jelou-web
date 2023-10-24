type TitleList = {
  id: number | string;
  label: string;
  labelClassName?: string;
  Icon?: React.FC<{
    color?: string;
    height?: number;
    width?: number;
  }>;
  size?: number;
  type?: string;
};

type PanelList = {
  id: number | string;
  name: string;
  Content?: () => JSX.Element;
};

export interface TabHeadlessProps {
  tabSpace?: string;
  titleList: TitleList[];
  panelList: PanelList[];
  className?: string;
  classNameNav?: string;
  classNameList?: string;
  classNamePanel?: string;
  enableBorder?: boolean;
  styleTabSelected?: string;
  classNameSelected?: string;
  styleTabNotSelected?: string;
  queryBadgeNumber?: number | null;
  headersBadgeNumber?: number | null;
}

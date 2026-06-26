import { renderSettingRow, type SettingItem } from '../SystemSetting';

interface UiTabProps {
  items: SettingItem[];
  values: Record<string, string>;
  setOne: (key: string, v: string) => void;
}

const UiTab: React.FC<UiTabProps> = ({ items, values, setOne }) => {
  const filtered = items.filter((it) => it.key.startsWith('ui.'));
  return <div>{filtered.map((it) => renderSettingRow(it, values, setOne))}</div>;
};

export default UiTab;

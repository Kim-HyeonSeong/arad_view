import { renderSettingRow, type SettingItem } from '../SystemSetting';

interface CommunicationTabProps {
  items: SettingItem[];
  values: Record<string, string>;
  setOne: (key: string, v: string) => void;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({ items, values, setOne }) => {
  const filtered = items.filter((it) => it.key.startsWith('agent.'));
  return <div>{filtered.map((it) => renderSettingRow(it, values, setOne))}</div>;
};

export default CommunicationTab;

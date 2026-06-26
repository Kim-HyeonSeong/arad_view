import { renderSettingRow, type SettingItem } from '../SystemSetting';

interface AuthTabProps {
  items: SettingItem[];
  values: Record<string, string>;
  setOne: (key: string, v: string) => void;
}

const AuthTab: React.FC<AuthTabProps> = ({ items, values, setOne }) => {
  const filtered = items.filter((it) => it.key.startsWith('auth.'));
  return <div>{filtered.map((it) => renderSettingRow(it, values, setOne))}</div>;
};

export default AuthTab;

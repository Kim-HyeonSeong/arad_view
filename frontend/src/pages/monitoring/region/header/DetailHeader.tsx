import { Typography, Tag, Button, Space } from 'antd';
import { ArrowLeftOutlined, DesktopOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MonitoringDetailItem } from '../MonitoringDetail';
import {
  getConstructorStr,
  getWallPadStr,
} from '../../../../commons/ConvertValStr';
import { useLocations } from '../../../../commons/LocationContext';

const { Title, Text } = Typography;

interface Props {
  controller: MonitoringDetailItem;
  onEdit?: () => void;
}

const DetailHeader: React.FC<Props> = ({ controller, onEdit }) => {
  const navigate = useNavigate();
  const { getRegionDistrict } = useLocations();
  const { region, district } = getRegionDistrict(controller.location_id);
  const hasError = controller.sgw_error > 0 || controller.pgw_error > 0;
  const ipPort = `${controller.ip}:${controller.port}`;

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ paddingLeft: 0, marginBottom: 4 }}
          >
            지역별 모니터링으로 돌아가기
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Title level={3} style={{ margin: 0 }}>{controller.name}</Title>
            <Tag style={{ fontSize: 13, padding: '2px 8px' }}>{ipPort}</Tag>
            {hasError ? <Tag color="red">오류</Tag> : <Tag color="green">정상</Tag>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 8, color: '#666' }}>
            <span><Text type="secondary">광역</Text> <Text strong>{region}</Text></span>
            <span><Text type="secondary">시/군/구</Text> <Text strong>{district}</Text></span>
            <span><Text type="secondary">시공사</Text> <Text strong>{getConstructorStr(controller.constructor_id)}</Text></span>
            <span><Text type="secondary">월패드 제조사</Text> <Text strong>{getWallPadStr(controller.homenet_id)}</Text></span>
            <span><Text type="secondary">마지막 연결</Text> <Text strong>{controller.last_connect_at}</Text></span>
          </div>
        </div>
        <Space wrap>
          <Button type="primary" icon={<DesktopOutlined />}>원격 접속</Button>
          <Button icon={<SettingOutlined />} onClick={onEdit}>설정 수정</Button>
        </Space>
      </div>
    </div>
  );
};

export default DetailHeader;

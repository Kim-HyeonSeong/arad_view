import { useState, useEffect } from 'react';
import { Table, Typography, Input, Button, Space } from 'antd';

const { Title } = Typography;

const MonitoringCompany: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>업체별 모니터링</Title>
            </div>
        </div>
    );
}

export default MonitoringCompany;
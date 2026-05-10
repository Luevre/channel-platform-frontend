import { Button, Card, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getParamDictList, getPlacementParamById } from '../../api/placementParam';

export function ParamDictPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [dictList, setDictList] = useState([]);
  const [paramName, setParamName] = useState('');
  const [paramKey, setParamKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get('id');
      if (!id) return;
      setLoading(true);
      try {
        const [dictRes, paramRes] = await Promise.all([
          getParamDictList(id),
          getPlacementParamById(id),
        ]);
        setDictList(dictRes?.data || []);
        setParamName(paramRes?.data?.paramName || '');
        setParamKey(paramRes?.data?.paramKey || '');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 250,
    },
    {
      title: paramKey ? `对应${paramKey}` : '对应tabKey',
      dataIndex: 'tabKey',
      width: 250,
    },
  ];

  return (
    <Card bordered={false} className="page-card detail-page-card">
      <div className="page-form-title">参数字典表{paramName ? `（${paramName}）` : ''}</div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dictList}
        loading={loading}
        pagination={false}
        style={{ marginTop: 16 }}
      />
      <div className="form-footer">
        <Space>
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      </div>
    </Card>
  );
}

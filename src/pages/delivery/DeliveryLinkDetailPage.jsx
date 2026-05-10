import { Button, Card, Descriptions, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDeliveryLinkById } from '../../api/deliveryLink';

export function DeliveryLinkDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get('id');
      if (!id) return;
      setLoading(true);
      try {
        const res = await getDeliveryLinkById(id);
        setData(res?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  if (loading || !data) {
    return <Card bordered={false} className="page-card">加载中...</Card>;
  }

  // 解析投放参数JSON
  let paramsEntries = [];
  if (data.paramsJson) {
    try {
      const parsed = JSON.parse(data.paramsJson);
      paramsEntries = Object.entries(parsed);
    } catch {
      // ignore
    }
  }

  return (
    <Card bordered={false} className="page-card detail-page-card">
      <div className="page-form-title">查看投放链接</div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="投放名称">{data.linkName}</Descriptions.Item>
        <Descriptions.Item label="投放渠道">{data.channel}</Descriptions.Item>
        <Descriptions.Item label="投放内容">{data.content}</Descriptions.Item>
        <Descriptions.Item label="推广模式">{data.promoMode}</Descriptions.Item>
        <Descriptions.Item label="投放链接">{data.fullUrl}</Descriptions.Item>
        {paramsEntries.map(([key, value]) => (
          <Descriptions.Item key={key} label={`投放参数`}>
            {key} = {value}
          </Descriptions.Item>
        ))}
        {paramsEntries.length === 0 && (
          <Descriptions.Item label="投放参数">-</Descriptions.Item>
        )}
      </Descriptions>
      <div className="form-footer">
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/delivery/link-management/edit?id=${data.id}`)}
          >
            编辑
          </Button>
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      </div>
    </Card>
  );
}

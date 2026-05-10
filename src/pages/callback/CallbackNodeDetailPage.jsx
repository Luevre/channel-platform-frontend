import { Button, Card, Descriptions, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getConvNodeById } from '../../api/convNode';
import { formatDateTime } from '../../utils/format';

export function CallbackNodeDetailPage() {
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
        const res = await getConvNodeById(id);
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

  return (
    <Card bordered={false} className="page-card detail-page-card">
      <div className="page-form-title">查看回传节点</div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="节点名">{data.nodeName}</Descriptions.Item>
        <Descriptions.Item label="convType值">{data.convType}</Descriptions.Item>
        <Descriptions.Item label="节点事件分类">{data.eventCategory}</Descriptions.Item>
        <Descriptions.Item label="节点事件说明">{data.eventDesc}</Descriptions.Item>
        <Descriptions.Item label="节点事件判断">{data.eventJudge}</Descriptions.Item>
        <Descriptions.Item label="创建人">{data.creatorName}</Descriptions.Item>
        <Descriptions.Item label="最近操作时间">{formatDateTime(data.updatedAt)}</Descriptions.Item>
      </Descriptions>
      <div className="form-footer">
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/callback/node-management/edit?id=${data.id}`)}
          >
            编辑
          </Button>
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      </div>
    </Card>
  );
}

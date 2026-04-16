import { Button, Card, Descriptions, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPlacementParamById } from '../../api/placementParam';

export function PlacementParameterDetailPage() {
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
        const res = await getPlacementParamById(id);
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
      <div className="page-form-title">查看投放参数</div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="参数名_中文">{data.paramName}</Descriptions.Item>
        <Descriptions.Item label="参数名_英文">{data.paramKey}</Descriptions.Item>
        <Descriptions.Item label="参数值示例">{data.paramValue}</Descriptions.Item>
        <Descriptions.Item label="参数分类">{data.category}</Descriptions.Item>
        <Descriptions.Item label="参数应用">{data.paramUsage}</Descriptions.Item>
        <Descriptions.Item label="参数管理员">
          <Button type="link" className="table-action-button">
            {data.manager}
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="参数申请通道">
          <Button size="small">点我申请</Button>
        </Descriptions.Item>
        <Descriptions.Item label="参数字典表">
          <Button size="small">点我查看</Button>
        </Descriptions.Item>
      </Descriptions>
      <div className="form-footer">
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/channel/placement-params/edit?id=${data.id}`)}
          >
            编辑
          </Button>
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      </div>
    </Card>
  );
}

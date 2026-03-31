import { Button, Card, Descriptions, Space } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { placementParameters } from '../../mock/platformData';

export function PlacementParameterDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentRecord = useMemo(() => {
    const parameterId = searchParams.get('id');
    return placementParameters.find((item) => item.id === parameterId) || placementParameters[0];
  }, [searchParams]);

  return (
    <Card bordered={false} className="page-card detail-page-card">
      <div className="page-form-title">查看投放参数</div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="参数名_中文">{currentRecord.nameCn}</Descriptions.Item>
        <Descriptions.Item label="参数名_英文">{currentRecord.nameEn}</Descriptions.Item>
        <Descriptions.Item label="参数值示例">{currentRecord.sampleValue}</Descriptions.Item>
        <Descriptions.Item label="参数分类">{currentRecord.category}</Descriptions.Item>
        <Descriptions.Item label="参数应用">{currentRecord.application}</Descriptions.Item>
        <Descriptions.Item label="参数管理员">
          <Button type="link" className="table-action-button">
            {currentRecord.manager}
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
            onClick={() => navigate(`/channel/placement-params/edit?id=${currentRecord.id}`)}
          >
            编辑
          </Button>
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      </div>
    </Card>
  );
}

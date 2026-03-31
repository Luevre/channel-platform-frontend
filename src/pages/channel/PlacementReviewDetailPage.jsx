import { Button, Card, Descriptions, Radio, Space, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { placementReviews } from '../../mock/platformData';

export function PlacementReviewDetailPage({ from }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reviewResult, setReviewResult] = useState('pass');
  const currentRecord = useMemo(() => {
    const reviewId = searchParams.get('id');
    return placementReviews.find((item) => item.id === reviewId) || placementReviews[0];
  }, [searchParams]);

  const actionButtons =
    from === 'review' ? (
      <Space>
        <Button onClick={() => message.info('已回填参数（Mock）')}>回填参数</Button>
        <Button type="primary" onClick={() => message.success('已通过（Mock）')}>
          通过
        </Button>
        <Button onClick={() => message.warning('已驳回（Mock）')}>驳回</Button>
      </Space>
    ) : null;

  return (
    <Card bordered={false} className="page-card detail-page-card" extra={actionButtons}>
      <div className="page-form-title">{from === 'review' ? '审核参数详情' : '审核我的参数'}</div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="参数新增">
          <Radio.Group value="new" disabled>
            <Radio value="new">新参数申请</Radio>
            <Radio value="existing">已有参数录入</Radio>
          </Radio.Group>
        </Descriptions.Item>
        <Descriptions.Item label="选择参数">{currentRecord.parameterName}</Descriptions.Item>
        <Descriptions.Item label="参数应用场景">{currentRecord.applicationScene}</Descriptions.Item>
        <Descriptions.Item label="参数使用说明">{currentRecord.usage}</Descriptions.Item>
        <Descriptions.Item label="参数值">{currentRecord.value}</Descriptions.Item>
        {from === 'review' ? (
          <Descriptions.Item label="审核结果">
            <Radio.Group value={reviewResult} onChange={(event) => setReviewResult(event.target.value)}>
              <Radio value="pass">通过</Radio>
              <Radio value="reject">驳回</Radio>
            </Radio.Group>
          </Descriptions.Item>
        ) : null}
      </Descriptions>
      <div className="form-footer">
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </Card>
  );
}

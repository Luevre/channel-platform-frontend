import { useState } from 'react';
import { Card, Button, Tag, Descriptions, Space } from 'antd';

const { Item: DescItem } = Descriptions;

export default function ConvStrategyCard({ data, onConfirm, onCancel, confirmed }) {
  const { strategyName, channel, description, nodes = [], applicant } = data || {};
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    setSubmitting(true);
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Card
      size="small"
      styles={{ body: { padding: 0 } }}
      style={{ width: 320, marginTop: 8 }}
    >
      {/* Header */}
      <div
        style={{
          background: '#1a56a0',
          color: '#fff',
          fontSize: 14,
          fontWeight: 500,
          padding: '10px 16px',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        回传策略确认
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* 基本信息 */}
        <Descriptions column={1} size="small" colon={false}>
          <DescItem label="策略名称">{strategyName || '-'}</DescItem>
          <DescItem label="投放渠道">
            <Tag color="blue">{channel || '-'}</Tag>
          </DescItem>
          <DescItem label="策略描述">{description || '-'}</DescItem>
          <DescItem label="申请人">{applicant || '-'}</DescItem>
        </Descriptions>

        {/* 关联节点 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>关联回传节点</div>
          <Space wrap size={[4, 6]}>
            {nodes.map((n, i) => (
              <Tag key={i} color="geekblue">
                {n.nodeName}（{n.convType}）
              </Tag>
            ))}
          </Space>
        </div>

        {/* 底部按钮 */}
        {confirmed ? (
          <div style={{ textAlign: 'right', fontSize: 12, color: '#9ca3af' }}>
            {typeof confirmed === 'string' ? confirmed : '已确认'}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button size="small" onClick={handleCancel} disabled={submitting}>
              取消
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={handleConfirm}
              loading={submitting}
              style={{ background: '#1a56a0', borderColor: '#1a56a0' }}
            >
              确认提交
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

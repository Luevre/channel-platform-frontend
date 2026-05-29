import { Card, Descriptions, Button, Tag, Typography } from 'antd';

const { Text } = Typography;

export default function ParamConfirmCard({ data, onConfirm, onCancel, confirmed }) {
  const { paramName, paramKey, category, description, applicant } = data || {};

  const timeLabel = confirmed
    ? (typeof confirmed === 'string' ? confirmed : '')
    : null;

  return (
    <Card
      size="small"
      styles={{
        body: { padding: 0 },
      }}
      style={{ width: 300, marginTop: 8 }}
    >
      {/* 蓝色 header */}
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
        参数申请确认
      </div>

      {/* 详情区域 */}
      <div style={{ padding: '12px 16px 0' }}>
        <Descriptions column={1} size="small" colon={false}>
          <Descriptions.Item label="参数中文名">{paramName || '-'}</Descriptions.Item>
          <Descriptions.Item label="参数英文名">
            <Text code>{paramKey || '-'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="参数分类">
            <Tag color="blue">{category || '-'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="参数说明">{description || '-'}</Descriptions.Item>
          <Descriptions.Item label="申请人">{applicant || '-'}</Descriptions.Item>
        </Descriptions>
      </div>

      {/* footer */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
        }}
      >
        {timeLabel ? (
          <span style={{ color: '#9ca3af', fontSize: 12 }}>{timeLabel}</span>
        ) : (
          <>
            <Button size="small" onClick={onCancel}>
              取消
            </Button>
            <Button
              type="primary"
              size="small"
              style={{ background: '#1a56a0', borderColor: '#1a56a0' }}
              onClick={onConfirm}
            >
              确认提交
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

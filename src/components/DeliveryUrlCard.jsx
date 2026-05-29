import { useState } from 'react';
import { Card, Button, Tag, Alert, message, Typography } from 'antd';
import {
  CheckCircleFilled,
  CopyOutlined,
  DownOutlined,
  UpOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import request from '../utils/request';

const { Text, Paragraph } = Typography;

export default function DeliveryUrlCard({ data, onRequestParam, confirmed }) {
  const { longUrl, shortUrl, params = {}, missingParams = [] } = data || {};
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    } catch {
      message.error('复制失败，请手动复制');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await request.post(
        '/delivery/my-scenes',
        {
          linkName: 'AI 生成的投放场景',
          channel: '',
          content: '',
          originUrl: longUrl,
          params: params,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      message.success('已保存到我的投放场景（草稿）');
    } catch {
      message.error('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  const paramEntries = Object.entries(params);

  return (
    <Card
      size="small"
      styles={{ body: { padding: 0 } }}
      style={{ width: 340, marginTop: 8 }}
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
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
        投放链接已生成
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* 短链 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>短链</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text
              strong
              copyable={false}
              style={{ fontSize: 16, color: '#1a56a0', flex: 1, wordBreak: 'break-all' }}
            >
              {shortUrl || '-'}
            </Text>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(shortUrl)}
            >
              一键复制
            </Button>
          </div>
        </div>

        {/* 长链（可折叠） */}
        <div style={{ marginBottom: 12 }}>
          <Button
            type="link"
            size="small"
            icon={expanded ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setExpanded(!expanded)}
            style={{ padding: 0, fontSize: 12 }}
          >
            {expanded ? '收起完整链接' : '展开完整链接'}
          </Button>
          {expanded && (
            <div style={{ marginTop: 4 }}>
              <Paragraph
                code
                copyable
                style={{
                  fontSize: 12,
                  wordBreak: 'break-all',
                  background: '#f5f5f5',
                  padding: 8,
                  borderRadius: 4,
                  margin: 0,
                }}
              >
                {longUrl || '-'}
              </Paragraph>
            </div>
          )}
        </div>

        {/* 参数明细 */}
        {paramEntries.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>拼接参数</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {paramEntries.map(([key, value]) => (
                <Tag key={key} color="#1a56a0">
                  {key}={value}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* 缺失参数 */}
        {missingParams.length > 0 && (
          <Alert
            type="warning"
            style={{ marginBottom: 12 }}
            message={
              <span>
                以下参数尚未申请：
                {missingParams.map((m) => m.paramName || m.paramKey).join('、')}
                ，是否立即申请？
              </span>
            }
            action={
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button size="small" type="primary" onClick={onRequestParam}>
                  去申请参数
                </Button>
                <Button size="small">忽略</Button>
              </div>
            }
          />
        )}

        {/* 保存按钮 */}
        <Button
          icon={<SaveOutlined />}
          size="small"
          onClick={handleSave}
          loading={saving}
          disabled={!!confirmed}
          style={{ width: '100%', marginTop: missingParams.length > 0 ? 0 : 4 }}
        >
          保存到我的投放场景
        </Button>
      </div>
    </Card>
  );
}

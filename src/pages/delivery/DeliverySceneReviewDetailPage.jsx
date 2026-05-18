import { Button, Card, Descriptions, Input, Radio, Space, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyDeliverySceneById, auditMyDeliveryScene } from '../../api/myDeliveryScene';
import { formatDateTime } from '../../utils/format';

const AUDIT_RESULT_MAP = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'blue' },
  2: { label: '已驳回', color: 'red' },
};

export function DeliverySceneReviewDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [reviewResult, setReviewResult] = useState(1); // 1=通过 2=驳回
  const [auditRemark, setAuditRemark] = useState('');
  const [loading, setLoading] = useState(false);

  const recordId = searchParams.get('id');

  useEffect(() => {
    if (!recordId) return;
    getMyDeliverySceneById(recordId).then((res) => {
      if (res.data) setData(res.data);
    });
  }, [recordId]);

  const handleAudit = async () => {
    if (reviewResult === 2 && !auditRemark.trim()) {
      message.warning('驳回时请填写驳回原因');
      return;
    }
    setLoading(true);
    try {
      await auditMyDeliveryScene({
        id: Number(recordId),
        auditResult: reviewResult,
        auditRemark: auditRemark.trim(),
      });
      message.success(reviewResult === 1 ? '审核通过，已写入正式投放链接' : '已驳回');
      navigate(-1);
    } catch {
      message.error('审核失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <Card bordered={false} className="page-card">加载中...</Card>;

  const isPending = data.auditResult === 0;
  const auditTag = AUDIT_RESULT_MAP[data.auditResult ?? 0];

  let paramsEntries = [];
  if (data.paramsJson) {
    try {
      paramsEntries = Object.entries(JSON.parse(data.paramsJson));
    } catch {
      // ignore malformed JSON
    }
  }

  const actionButtons = isPending ? (
    <Space>
      <Button type="primary" loading={loading} onClick={handleAudit}>
        {reviewResult === 1 ? '通过' : '驳回'}
      </Button>
    </Space>
  ) : null;

  return (
    <Card bordered={false} className="page-card detail-page-card" extra={actionButtons}>
      <div className="page-form-title">
        {isPending ? '审核投放场景' : '查阅投放场景'}
      </div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="链接名称">{data.linkName}</Descriptions.Item>
        <Descriptions.Item label="投放渠道">{data.channel}</Descriptions.Item>
        <Descriptions.Item label="投放内容">{data.content}</Descriptions.Item>
        <Descriptions.Item label="推广模式">{data.promoMode}</Descriptions.Item>
        <Descriptions.Item label="原始链接">{data.originUrl || '-'}</Descriptions.Item>
        <Descriptions.Item label="完整渠道地址">{data.fullUrl || '-'}</Descriptions.Item>
        <Descriptions.Item label="短链地址">{data.shortUrl || '-'}</Descriptions.Item>
        <Descriptions.Item label="短链失效时间">
          {formatDateTime(data.shortUrlExpireAt) || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="短链状态">{data.linkStatus || '-'}</Descriptions.Item>
        <Descriptions.Item label="投放参数">
          {paramsEntries.length > 0
            ? paramsEntries.map(([k, v]) => <div key={k}>{k} = {v}</div>)
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="申请人">{data.applicant || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{data.creatorName || '-'}</Descriptions.Item>
        <Descriptions.Item label="提交时间">
          {formatDateTime(data.submittedAt) || '-'}
        </Descriptions.Item>

        {isPending ? (
          <>
            <Descriptions.Item label="审核结果">
              <Radio.Group
                value={reviewResult}
                onChange={(e) => {
                  setReviewResult(e.target.value);
                  if (e.target.value === 1) setAuditRemark('');
                }}
              >
                <Radio value={1}>通过</Radio>
                <Radio value={2}>驳回</Radio>
              </Radio.Group>
            </Descriptions.Item>
            {reviewResult === 2 && (
              <Descriptions.Item label="驳回原因">
                <Input.TextArea
                  rows={3}
                  placeholder="请填写驳回原因"
                  value={auditRemark}
                  onChange={(e) => setAuditRemark(e.target.value)}
                  style={{ width: 400 }}
                />
              </Descriptions.Item>
            )}
          </>
        ) : (
          <>
            <Descriptions.Item label="审核状态">
              <Tag color={auditTag.color}>{auditTag.label}</Tag>
            </Descriptions.Item>
            {data.auditor && (
              <Descriptions.Item label="审核人">{data.auditor}</Descriptions.Item>
            )}
            {data.auditTime && (
              <Descriptions.Item label="审核时间">
                {formatDateTime(data.auditTime)}
              </Descriptions.Item>
            )}
            {data.auditRemark && (
              <Descriptions.Item label="驳回原因">{data.auditRemark}</Descriptions.Item>
            )}
          </>
        )}
      </Descriptions>

      <div className="form-footer">
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </Card>
  );
}

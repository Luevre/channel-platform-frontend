import { Button, Card, Descriptions, Input, Radio, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyParameterById, auditMyParameter } from '../../api/myParameter';
import { formatDateTime } from '../../utils/format';

export function PlacementReviewDetailPage({ from }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reviewResult, setReviewResult] = useState(1); // 1=通过 2=驳回
  const [auditRemark, setAuditRemark] = useState('');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const recordId = searchParams.get('id');

  useEffect(() => {
    if (!recordId) return;
    getMyParameterById(recordId).then((res) => {
      if (res.data) setCurrentRecord(res.data);
    });
  }, [recordId]);

  const handleAudit = async () => {
    if (reviewResult === 2 && !auditRemark.trim()) {
      message.warning('驳回时请填写驳回原因');
      return;
    }
    setLoading(true);
    try {
      await auditMyParameter({
        id: Number(recordId),
        auditResult: reviewResult,       // 1=通过 2=驳回
        auditRemark: auditRemark.trim(),
      });
      message.success(reviewResult === 1 ? '已通过，参数已写入正式库' : '已驳回');
      navigate(-1);
    } catch {
      message.error('审核失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 只有待审核（auditResult=0）时才显示审核按钮
  const isPending = currentRecord?.auditResult === 0;

  const actionButtons = from === 'review' && isPending ? (
    <Space>
      <Button type="primary" loading={loading} onClick={handleAudit}>
        {reviewResult === 1 ? '通过' : '驳回'}
      </Button>
    </Space>
  ) : null;

  if (!currentRecord) return null;

  const auditResultLabel = { 0: '待审核', 1: '已通过', 2: '已驳回' };

  return (
    <Card bordered={false} className="page-card detail-page-card" extra={actionButtons}>
      <div className="page-form-title">
        {from === 'review' ? '审核参数详情' : '查阅参数详情'}
      </div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="参数应用场景">{currentRecord.scene}</Descriptions.Item>
        <Descriptions.Item label="参数名">{currentRecord.parameterName}</Descriptions.Item>
        <Descriptions.Item label="参数值">{currentRecord.value}</Descriptions.Item>
        <Descriptions.Item label="参数使用说明">{currentRecord.usage}</Descriptions.Item>
        <Descriptions.Item label="申请人">{currentRecord.applicant}</Descriptions.Item>
        <Descriptions.Item label="提交时间">
          {formatDateTime(currentRecord.submittedAt)}
        </Descriptions.Item>

        {isPending && from === 'review' ? (
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
              {auditResultLabel[currentRecord.auditResult ?? 0]}
            </Descriptions.Item>
            {currentRecord.auditor && (
              <Descriptions.Item label="审核人">{currentRecord.auditor}</Descriptions.Item>
            )}
            {currentRecord.auditRemark && (
              <Descriptions.Item label="驳回原因">{currentRecord.auditRemark}</Descriptions.Item>
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

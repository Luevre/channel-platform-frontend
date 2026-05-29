import { Button, Card, Descriptions, Input, Modal, Space, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStrategyReviewDetail, auditStrategy } from '../../api/convStrategy';
import { formatDateTime } from '../../utils/format';

const AUDIT_STATUS_MAP = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'blue' },
  2: { label: '已驳回', color: 'red' },
};

export function StrategyReviewDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');

  useEffect(() => {
    if (!id) return;
    getStrategyReviewDetail(id).then((res) => {
      if (res.data) setRecord(res.data);
    });
  }, [id]);

  const handlePass = async () => {
    setLoading(true);
    try {
      await auditStrategy(id, { auditResult: 1 });
      message.success('审核已通过');
      navigate(-1);
    } catch {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectRemark.trim()) {
      message.warning('请填写驳回原因');
      return;
    }
    setLoading(true);
    try {
      await auditStrategy(id, { auditResult: 2, auditRemark: rejectRemark.trim() });
      message.success('已驳回');
      navigate(-1);
    } catch {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  const isPending = record.auditStatus === 0;

  const nodeColumns = [
    { title: '节点名称', dataIndex: 'nodeName', width: 150 },
    { title: '回传类型', dataIndex: 'convType', width: 100 },
    { title: '事件分类', dataIndex: 'eventCategory', width: 130 },
    { title: '事件描述', dataIndex: 'eventDesc', width: 130 },
    { title: '回传值', dataIndex: 'convValue', render: (v) => v || '-' },
    { title: '广告参数', dataIndex: 'adParam', width: 120, render: (v) => v || '-' },
  ];

  return (
    <Card
      bordered={false}
      className="page-card detail-page-card"
      extra={
        isPending ? (
          <Space>
            <Button type="primary" onClick={handlePass} loading={loading}>
              审核通过
            </Button>
            <Button danger onClick={() => setRejectOpen(true)} loading={loading}>
              审核驳回
            </Button>
          </Space>
        ) : null
      }
    >
      <div className="page-form-title">
        {isPending ? '审核回传策略' : '查阅回传策略'}
      </div>

      <Descriptions column={2} className="detail-descriptions" size="small">
        <Descriptions.Item label="策略名称">{record.strategyName || '-'}</Descriptions.Item>
        <Descriptions.Item label="应用渠道">{record.channel || '-'}</Descriptions.Item>
        <Descriptions.Item label="渠道编码">{record.channelCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="业务编号">{record.bizNo || '-'}</Descriptions.Item>
        <Descriptions.Item label="策略模型">{record.strategyRule || '-'}</Descriptions.Item>
        <Descriptions.Item label="回传比例">
          {record.callbackRatio != null ? `${record.callbackRatio}%` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="广告商">{record.adInfo || '-'}</Descriptions.Item>
        <Descriptions.Item label="策略参数">{record.strategyParams || '-'}</Descriptions.Item>
        <Descriptions.Item label="监测链接" span={2}>
          {record.monitorUrl || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="策略描述" span={2}>
          {record.description || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="申请人">{record.applicant || record.creatorName || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {formatDateTime(record.createdAt)}
        </Descriptions.Item>

        {!isPending && (
          <>
            <Descriptions.Item label="审核状态">
              <Tag color={AUDIT_STATUS_MAP[record.auditStatus]?.color}>
                {AUDIT_STATUS_MAP[record.auditStatus]?.label || '-'}
              </Tag>
            </Descriptions.Item>
            {record.auditRemark && (
              <Descriptions.Item label="驳回原因" span={2}>
                {record.auditRemark}
              </Descriptions.Item>
            )}
          </>
        )}
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: '#1f2937' }}>
          关联回传节点
        </div>
        <Table
          rowKey="nodeId"
          columns={nodeColumns}
          dataSource={record.nodes || []}
          pagination={false}
          size="small"
        />
      </div>

      <div className="form-footer">
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>

      <Modal
        title="驳回原因"
        open={rejectOpen}
        onOk={handleReject}
        onCancel={() => { setRejectOpen(false); setRejectRemark(''); }}
        confirmLoading={loading}
        okText="确认驳回"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          placeholder="请填写驳回原因（必填）"
          value={rejectRemark}
          onChange={(e) => setRejectRemark(e.target.value)}
        />
      </Modal>
    </Card>
  );
}

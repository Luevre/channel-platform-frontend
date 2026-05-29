import { Button, Card, Descriptions, Input, Modal, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getConvStrategyReviewById,
  passConvStrategyReview,
  rejectConvStrategyReview,
} from '../../api/convStrategyReview';
import { formatDateTime } from '../../utils/format';

const AUDIT_STATUS_MAP = {
  0: '待审核',
  1: '已通过',
  2: '已驳回',
};

export function ConvStrategyReviewDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');

  useEffect(() => {
    if (!id) return;
    getConvStrategyReviewById(id).then((res) => {
      if (res.data) setRecord(res.data);
    });
  }, [id]);

  const handlePass = async () => {
    setLoading(true);
    try {
      await passConvStrategyReview(id);
      message.success('审核已通过');
      navigate('/callback/strategy-review');
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
      await rejectConvStrategyReview(id, { auditRemark: rejectRemark.trim() });
      message.success('已驳回');
      navigate('/callback/strategy-review');
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
    { title: 'convType', dataIndex: 'convType', width: 100 },
    { title: '事件分类', dataIndex: 'eventCategory', width: 130 },
    { title: '回传值', dataIndex: 'convValue', render: (v) => v || '-' },
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

      {/* 基本信息 */}
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
              {AUDIT_STATUS_MAP[record.auditStatus] || '-'}
            </Descriptions.Item>
            {record.auditRemark && (
              <Descriptions.Item label="驳回原因" span={2}>
                {record.auditRemark}
              </Descriptions.Item>
            )}
          </>
        )}
      </Descriptions>

      {/* 关联节点 */}
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

      {/* 返回 */}
      <div className="form-footer">
        <Button onClick={() => navigate('/callback/strategy-review')}>返回</Button>
      </div>

      {/* 驳回 Modal */}
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

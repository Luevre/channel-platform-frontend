import { Button, Card, Descriptions, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyParameterById } from '../../api/myParameter';
import { formatDateTime } from '../../utils/format';

const STATUS_MAP = {
  0: { label: '草稿', color: 'default' },
  1: { label: '已提交', color: 'blue' },
  2: { label: '已归档', color: 'green' },
};

const AUDIT_MAP = {
  0: { label: '待审核', color: 'default' },
  1: { label: '处理中', color: 'processing' },
  2: { label: '已完成', color: 'success' },
  3: { label: '驳回', color: 'error' },
};

export function MyParameterDetailPage() {
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
        const res = await getMyParameterById(id);
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

  const statusInfo = STATUS_MAP[data.status] ?? { label: '未知', color: 'default' };
  const auditInfo = AUDIT_MAP[data.auditResult] ?? { label: '待审核', color: 'default' };
  const isDraft = data.status === 0;

  return (
    <Card bordered={false} className="page-card detail-page-card">
      <div className="page-form-title">查看我的参数</div>
      <Descriptions column={1} className="detail-descriptions">
        <Descriptions.Item label="选择参数">{data.parameterName}</Descriptions.Item>
        <Descriptions.Item label="参数应用场景">{data.scene}</Descriptions.Item>
        <Descriptions.Item label="参数使用说明">{data.usage}</Descriptions.Item>
        <Descriptions.Item label="参数值">{data.value}</Descriptions.Item>
        <Descriptions.Item label="审核状态">
          <Tag color={auditInfo.color}>{auditInfo.label}</Tag>
        </Descriptions.Item>
        {data.handler && (
          <Descriptions.Item label="当前处理人">{data.handler}</Descriptions.Item>
        )}
        <Descriptions.Item label="申请人">{data.applicant}</Descriptions.Item>
        <Descriptions.Item label="提交时间">{formatDateTime(data.submittedAt)}</Descriptions.Item>
      </Descriptions>
      <div className="form-footer">
        <Space>
          {isDraft && (
            <Button
              type="primary"
              onClick={() => navigate(`/channel/my-params/review?id=${data.id}`)}
            >
              编辑
            </Button>
          )}
          <Button onClick={() => navigate(-1)}>返回</Button>
        </Space>
      </div>
    </Card>
  );
}

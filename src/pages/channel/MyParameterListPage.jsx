import { Button, Card, Form, Input, Select, Space, Table, Tag, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveMyParameter, getMyParameterPage, submitMyParameter } from '../../api/myParameter';
import { formatDateTime } from '../../utils/format';

// 提交状态映射
const STATUS_MAP = {
  0: { label: '草稿', color: 'default' },
  1: { label: '已提交', color: 'blue' },
  2: { label: '已归档', color: 'green' },
};

// 审核状态映射: 0=待审核 1=已通过 2=已驳回
const AUDIT_MAP = {
  0: { label: '待审核', color: 'default' },
  1: { label: '已通过', color: 'success' },
  2: { label: '已驳回', color: 'error' },
};

export function MyParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    scene: '',
    value: '',
    parameterName: undefined,
    auditResult: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [loading, setLoading] = useState(false);

  const parameterOptions = [
    { label: '全部', value: '' },
    { label: 'channel_type | 渠道编码', value: 'channel_type | 渠道编码' },
    { label: 'employee_id | 员工工号', value: 'employee_id | 员工工号' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        scene: filters.scene || undefined,
        value: filters.value || undefined,
        parameterName: filters.parameterName || undefined,
        auditResult: filters.auditResult != null ? filters.auditResult : undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getMyParameterPage(params);
      setDataSource(res?.data?.records || []);
      setTotal(res?.data?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.current, pagination.size]);

  const columns = [
    {
      title: '参数应用场景',
      dataIndex: 'scene',
      width: 130,
      render: (value, record) => (
        <Button
          type="link"
          className="table-action-button"
          onClick={() => navigate(`/channel/my-params/view?id=${record.id}`)}
        >
          {value}
        </Button>
      ),
    },
    { title: '参数值', dataIndex: 'value', width: 160 },
    { title: '参数名', dataIndex: 'parameterName', width: 210 },
    { title: '参数使用说明', dataIndex: 'usage', width: 280 },
    {
      title: '审核状态',
      dataIndex: 'auditResult',
      width: 100,
      render: (val, record) => {
        const a = AUDIT_MAP[val] ?? { label: '待审核', color: 'default' };
        const tooltipText = record.handler
          ? `当前处理人：${record.handler}`
          : '暂无处理人';
        return (
          <Tooltip title={tooltipText}>
            <Tag color={a.color}>{a.label}</Tag>
          </Tooltip>
        );
      },
    },
    { title: '申请人', dataIndex: 'applicant', width: 90 },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      width: 170,
      render: formatDateTime,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => {
        const isDraft = record.status === 0;       // 草稿：可编辑、可提交、可归档
        const isSubmitted = record.status === 1;   // 已提交：只能归档
        return (
          <Space size={8}>
            <Button
              type="link"
              className="table-action-button"
              disabled={!isDraft}
              onClick={() => navigate(`/channel/my-params/review?id=${record.id}`)}
            >
              编辑
            </Button>
            <Button
              type="link"
              className="table-action-button"
              disabled={!isDraft}
              onClick={async () => {
                try {
                  await submitMyParameter(record.id);
                  message.success('已提交');
                  fetchData();
                } catch {
                  message.error('提交失败');
                }
              }}
            >
              提交
            </Button>
            <Button
              type="link"
              className="table-action-button"
              disabled={record.status === 2}
              onClick={async () => {
                try {
                  await archiveMyParameter(record.id);
                  message.info('已归档');
                  fetchData();
                } catch {
                  message.error('归档失败');
                }
              }}
            >
              归档
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters({
      scene: values.scene?.trim() || '',
      value: values.value?.trim() || '',
      parameterName: values.parameterName || undefined,
      auditResult: values.auditResult != null ? values.auditResult : undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ scene: '', value: '', parameterName: undefined, auditResult: undefined });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page.current,
      size: page.pageSize,
    }));
  };

  return (
    <Card bordered={false} className="page-card">
      <div className="page-toolbar">
        <Form form={form} layout="inline" className="filter-form">
          <Form.Item label="参数应用渠道" name="scene">
            <Input placeholder="请输入参数应用场景" allowClear />
          </Form.Item>
          <Form.Item label="参数值" name="value">
            <Input placeholder="请输入参数值" allowClear />
          </Form.Item>
          <Form.Item label="参数名" name="parameterName">
            <Select placeholder="全部" allowClear options={parameterOptions} style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="审核状态" name="auditResult">
            <Select placeholder="全部" allowClear style={{ width: 140 }} options={[
              { label: '待审核', value: 0 },
              { label: '已通过', value: 1 },
              { label: '已驳回', value: 2 },
            ]} />
          </Form.Item>
        </Form>
        <div className="toolbar-actions">
          <Space>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
          <Button type="primary" onClick={() => navigate('/channel/my-params/create')}>
            + 添加我的参数
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total,
          showSizeChanger: false,
          showTotal: (t, range) => `当前第${range[0]}-${range[1]}条 总计${t}条`,
        }}
        scroll={{ x: 1420 }}
      />
    </Card>
  );
}

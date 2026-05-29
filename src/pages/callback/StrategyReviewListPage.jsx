import { Button, Card, DatePicker, Form, Input, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStrategyReviewList } from '../../api/convStrategy';
import { formatDateTime } from '../../utils/format';

const { RangePicker } = DatePicker;

const AUDIT_STATUS_MAP = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'blue' },
  2: { label: '已驳回', color: 'red' },
};

export function StrategyReviewListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const [start, end] = values.submittedAt || [];
      const params = {
        current: page,
        size: 10,
        strategyName: values.strategyName?.trim() || undefined,
        channel: values.channel?.trim() || undefined,
        strategyRule: values.strategyRule?.trim() || undefined,
        creatorName: values.creatorName?.trim() || undefined,
        startTime: start ? start.format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: end ? end.format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      const res = await getStrategyReviewList(params);
      if (res?.data) {
        setDataSource(res.data.records || []);
        setTotal(res.data.total || 0);
      }
    } catch {
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, []);

  const columns = [
    {
      title: '策略名称',
      dataIndex: 'strategyName',
      width: 170,
      render: (value, record) => (
        <Button
          type="link"
          className="table-action-button"
          onClick={() => navigate(`/callback/strategy-review/${record.id}`)}
        >
          {value}
        </Button>
      ),
    },
    { title: '应用渠道', dataIndex: 'channel', width: 110 },
    { title: '策略模型', dataIndex: 'strategyRule', width: 140, render: (v) => v || '-' },
    { title: '申请人', dataIndex: 'creatorName', width: 90 },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      width: 170,
      render: formatDateTime,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: 100,
      render: (val) => {
        const s = AUDIT_STATUS_MAP[val ?? 0];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          className="table-action-button"
          onClick={() => navigate(`/callback/strategy-review/${record.id}`)}
        >
          {record.auditStatus === 0 ? '审核' : '查阅'}
        </Button>
      ),
    },
  ];

  const handleSearch = () => { setCurrent(1); fetchData(1); };
  const handleReset = () => { form.resetFields(); setCurrent(1); fetchData(1); };

  return (
    <Card bordered={false} className="page-card" title="回传策略审核">
      <Form form={form} layout="inline" className="filter-form filter-form-stacked">
        <Form.Item label="策略名称" name="strategyName">
          <Input placeholder="请输入策略名称" allowClear />
        </Form.Item>
        <Form.Item label="应用渠道" name="channel">
          <Input placeholder="请输入渠道名称" allowClear />
        </Form.Item>
        <Form.Item label="策略模型" name="strategyRule">
          <Input placeholder="请输入策略模型" allowClear />
        </Form.Item>
        <Form.Item label="申请人" name="creatorName">
          <Input placeholder="请输入申请人" allowClear />
        </Form.Item>
        <Form.Item label="提交时间" name="submittedAt">
          <RangePicker />
        </Form.Item>
        <Form.Item className="filter-actions-inline">
          <Space>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current,
          total,
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (t, range) => `当前第${range[0]}-${range[1]}条 总计${t}条`,
          onChange: (page) => { setCurrent(page); fetchData(page); },
        }}
        scroll={{ x: 1100 }}
      />
    </Card>
  );
}

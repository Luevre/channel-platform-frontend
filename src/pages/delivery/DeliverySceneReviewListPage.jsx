import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDeliveryScenePage } from '../../api/myDeliveryScene';
import { formatDateTime } from '../../utils/format';

const { RangePicker } = DatePicker;

const PROMO_MODES = ['网销线上推广', '网金线下推广', '网销线下推广'];

const AUDIT_RESULT_MAP = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'blue' },
  2: { label: '已驳回', color: 'red' },
};

export function DeliverySceneReviewListPage() {
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
        linkName: values.name?.trim() || undefined,
        channel: values.channel?.trim() || undefined,
        content: values.content?.trim() || undefined,
        promoMode: values.mode || undefined,
        creatorName: values.creator?.trim() || undefined,
        startTime: start ? start.format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: end ? end.format('YYYY-MM-DD HH:mm:ss') : undefined,
        status: 1, // 只查已提交的记录（待审核池）
      };
      const res = await getMyDeliveryScenePage(params);
      if (res.data) {
        setDataSource(res.data.records || []);
        setTotal(res.data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, []);

  const columns = [
    {
      title: '链接名称', dataIndex: 'linkName', width: 160,
      render: (value) => <Button type="link" className="table-action-button">{value}</Button>,
    },
    { title: '投放渠道', dataIndex: 'channel', width: 90 },
    { title: '投放内容', dataIndex: 'content', width: 110 },
    { title: '投放推广模式', dataIndex: 'promoMode', width: 130 },
    { title: '短链状态', dataIndex: 'linkStatus', width: 90 },
    { title: '创建人', dataIndex: 'creatorName', width: 90 },
    { title: '提交时间', dataIndex: 'submittedAt', width: 170, render: formatDateTime },
    {
      title: '审核状态',
      dataIndex: 'auditResult',
      width: 100,
      render: (val) => {
        const s = AUDIT_RESULT_MAP[val ?? 0];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          className="table-action-button"
          onClick={() => navigate(`/delivery/scene-review/detail?id=${record.id}`)}
        >
          {record.auditResult === 0 ? '审核' : '查阅'}
        </Button>
      ),
    },
  ];

  const handleSearch = () => { setCurrent(1); fetchData(1); };
  const handleReset = () => { form.resetFields(); setCurrent(1); fetchData(1); };

  return (
    <Card bordered={false} className="page-card">
      <Form form={form} layout="inline" className="filter-form filter-form-stacked">
        <Form.Item label="链接名称" name="name">
          <Input placeholder="请输入链接名称" allowClear />
        </Form.Item>
        <Form.Item label="投放渠道" name="channel">
          <Input placeholder="请输入投放渠道" allowClear style={{ width: 160 }} />
        </Form.Item>
        <Form.Item label="投放内容" name="content">
          <Input placeholder="请输入投放内容" allowClear style={{ width: 160 }} />
        </Form.Item>
        <Form.Item label="投放推广模式" name="mode">
          <Select placeholder="全部" allowClear
            options={PROMO_MODES.map((m) => ({ label: m, value: m }))}
            style={{ width: 170 }} />
        </Form.Item>
        <Form.Item label="创建人" name="creator">
          <Input placeholder="请输入创建人名称" allowClear />
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
        scroll={{ x: 1320 }}
      />
    </Card>
  );
}

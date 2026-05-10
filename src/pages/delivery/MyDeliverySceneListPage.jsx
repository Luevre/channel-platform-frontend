import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveMyDeliveryScene, getMyDeliveryScenePage, submitMyDeliveryScene } from '../../api/myDeliveryScene';
import { formatDateTime } from '../../utils/format';

const { RangePicker } = DatePicker;

const PROMO_MODES = ['网销线上推广', '网金线下推广', '网销线下推广'];

const AUDIT_MAP = {
  0: { label: '待审核', color: 'default' },
  1: { label: '已通过', color: 'success' },
  2: { label: '已驳回', color: 'error' },
};

export function MyDeliverySceneListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    linkName: '', channel: '', content: '', promoMode: '', creatorName: '', startTime: '', endTime: '',
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyDeliveryScenePage({
        linkName: filters.linkName || undefined,
        channel: filters.channel || undefined,
        content: filters.content || undefined,
        promoMode: filters.promoMode || undefined,
        creatorName: filters.creatorName || undefined,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
        current: pagination.current,
        size: pagination.size,
      });
      setDataSource(res?.data?.records || []);
      setTotal(res?.data?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters, pagination.current, pagination.size]); // eslint-disable-line

  const columns = [
    {
      title: '链接名称', dataIndex: 'linkName', width: 160,
      render: (value) => <Button type="link" className="table-action-button">{value}</Button>,
    },
    { title: '投放渠道', dataIndex: 'channel', width: 90 },
    { title: '投放内容', dataIndex: 'content', width: 110 },
    { title: '投放推广模式', dataIndex: 'promoMode', width: 130 },
    { title: '短链状态', dataIndex: 'linkStatus', width: 90 },
    { title: '提交时间', dataIndex: 'submittedAt', width: 170, render: formatDateTime },
    {
      title: '审核状态',
      dataIndex: 'auditResult',
      width: 100,
      render: (val) => {
        const a = AUDIT_MAP[val] ?? { label: '-', color: 'default' };
        return <Tag color={a.color}>{a.label}</Tag>;
      },
    },
    { title: '创建人', dataIndex: 'creatorName', width: 90 },
    {
      title: '操作', key: 'action', width: 170, fixed: 'right',
      render: (_, record) => {
        const isDraft = record.status === 0;
        return (
          <Space size={8}>
            <Button type="link" className="table-action-button" disabled={!isDraft}
              onClick={() => navigate(`/delivery/my-scene/edit?id=${record.id}`)}>
              编辑
            </Button>
            <Button type="link" className="table-action-button"
              disabled={record.status === 2}
              onClick={async () => {
                try {
                  await archiveMyDeliveryScene(record.id);
                  message.info('已归档');
                  fetchData();
                } catch { message.error('归档失败'); }
              }}>
              归档
            </Button>
            <Button type="link" className="table-action-button">数据</Button>
          </Space>
        );
      },
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const [start, end] = values.submittedAt || [];
    setFilters({
      linkName: values.name?.trim() || '',
      channel: values.channel || '',
      content: values.content || '',
      promoMode: values.mode || '',
      creatorName: values.creator?.trim() || '',
      startTime: start ? start.format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: end ? end.format('YYYY-MM-DD HH:mm:ss') : '',
    });
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ linkName: '', channel: '', content: '', promoMode: '', creatorName: '', startTime: '', endTime: '' });
    setPagination((p) => ({ ...p, current: 1 }));
  };

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
          <Button type="primary" onClick={() => navigate('/delivery/my-scene/create')}>
            + 新增投放场景
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={(page) => setPagination({ current: page.current, size: page.pageSize })}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total,
          showSizeChanger: false,
          showTotal: (t, range) => `当前第${range[0]}-${range[1]}条 总计${t}条`,
        }}
        scroll={{ x: 1400 }}
      />
    </Card>
  );
}

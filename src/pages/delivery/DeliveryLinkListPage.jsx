import { Button, Card, DatePicker, Form, Input, Select, Space, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveDeliveryLink, getDeliveryLinkPage } from '../../api/deliveryLink';
import { formatDateTime } from '../../utils/format';
import { exportToExcel } from '../../utils/exportExcel';

const { RangePicker } = DatePicker;

const PROMO_MODES = ['网销线上推广', '网金线下推广', '网销线下推广'];

export function DeliveryLinkListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    linkName: '', channel: '', content: '', promoMode: '', creatorName: '', startTime: '', endTime: '',
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDeliveryLinkPage({
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
      render: (value, record) => (
        <Button type="link" className="table-action-button"
          onClick={() => navigate(`/delivery/link-management/view?id=${record.id}`)}>
          {value}
        </Button>
      ),
    },
    { title: '投放渠道', dataIndex: 'channel', width: 90 },
    { title: '投放内容', dataIndex: 'content', width: 110 },
    { title: '投放推广模式', dataIndex: 'promoMode', width: 130 },
    { title: '短链状态', dataIndex: 'linkStatus', width: 90 },
    { title: '短链失效时间', dataIndex: 'shortUrlExpireAt', width: 170, render: formatDateTime },
    { title: '创建人', dataIndex: 'creatorName', width: 90 },
    { title: '提交时间', dataIndex: 'createdAt', width: 170, render: formatDateTime },
    {
      title: '操作', key: 'action', width: 150, fixed: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" className="table-action-button"
            onClick={() => navigate(`/delivery/link-management/edit?id=${record.id}`)}>
            编辑
          </Button>
          <Button type="link" className="table-action-button"
            onClick={() => archiveDeliveryLink(record.id).then(fetchData)}>
            归档
          </Button>
          <Button type="link" className="table-action-button">数据</Button>
        </Space>
      ),
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

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await getDeliveryLinkPage({
        linkName: filters.linkName || undefined,
        channel: filters.channel || undefined,
        content: filters.content || undefined,
        promoMode: filters.promoMode || undefined,
        creatorName: filters.creatorName || undefined,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
        current: 1,
        size: 9999,
      });
      const allData = res?.data?.records || [];
      if (!allData.length) { message.warning('暂无数据可导出'); return; }
      const exportColumns = [
        { title: '链接名称', dataIndex: 'linkName' },
        { title: '投放渠道', dataIndex: 'channel' },
        { title: '投放内容', dataIndex: 'content' },
        { title: '投放推广模式', dataIndex: 'promoMode' },
        { title: '短链状态', dataIndex: 'linkStatus' },
        { title: '短链失效时间', dataIndex: 'shortUrlExpireAt' },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '提交时间', dataIndex: 'createdAt' },
      ];
      const formatted = allData.map((row) => ({
        ...row,
        shortUrlExpireAt: row.shortUrlExpireAt ? formatDateTime(row.shortUrlExpireAt) : '',
        createdAt: row.createdAt ? formatDateTime(row.createdAt) : '',
      }));
      exportToExcel(formatted, exportColumns, '投放链接管理');
      message.success(`已导出 ${allData.length} 条数据`);
    } catch {
      message.error('导出失败，请重试');
    } finally {
      setExporting(false);
    }
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
          <Space>
            <Button icon={<DownloadOutlined />} loading={exporting} onClick={handleExport}>
              导出 Excel
            </Button>
            <Button type="primary" onClick={() => navigate('/delivery/link-management/create')}>
              + 新增投放链接
            </Button>
          </Space>
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

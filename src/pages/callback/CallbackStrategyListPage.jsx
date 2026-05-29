import { Button, Card, DatePicker, Form, Input, Select, Space, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveConvStrategy, getConvStrategyPage } from '../../api/convStrategy';
import { formatDateTime } from '../../utils/format';
import { exportToExcel } from '../../utils/exportExcel';

const { RangePicker } = DatePicker;

export function CallbackStrategyListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    strategyName: '',
    channel: '',
    strategyRule: undefined,
    creatorName: '',
    startTime: '',
    endTime: '',
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        strategyName: filters.strategyName || undefined,
        channel: filters.channel || undefined,
        strategyRule: filters.strategyRule || undefined,
        creatorName: filters.creatorName || undefined,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getConvStrategyPage(params);
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
      title: '策略ID',
      dataIndex: 'id',
      width: 90,
      render: (value) => String(value).padStart(4, '0'),
    },
    {
      title: '策略名称',
      dataIndex: 'strategyName',
      width: 170,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: '应用渠道', dataIndex: 'channel', width: 140 },
    { title: '渠道编码', dataIndex: 'bizNo', width: 120 },
    { title: '策略模型', dataIndex: 'strategyRule', width: 110 },
    {
      title: '回传比例',
      dataIndex: 'callbackRatio',
      width: 90,
      render: (value) => (value != null ? `${value}%` : '-'),
    },
    { title: '策略节点概览', dataIndex: 'nodeOverview', width: 220 },
    { title: '广告商', dataIndex: 'adInfo', width: 90 },
    { title: '策略监测链接', dataIndex: 'strategyParams', width: 220 },
    { title: '创建人', dataIndex: 'creatorName', width: 90 },
    { title: '提交时间', dataIndex: 'createdAt', width: 170, render: formatDateTime },
    {
      title: '操作',
      key: 'action',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="link"
            className="table-action-button"
            onClick={() => navigate(`/callback/strategy-management/edit?id=${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            className="table-action-button"
            onClick={() => archiveConvStrategy(record.id).then(fetchData)}
          >
            归档
          </Button>
          <Button type="link" className="table-action-button">
            数据
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const [start, end] = values.submittedAt || [];
    setFilters({
      strategyName: values.strategyName?.trim() || '',
      channel: values.channel?.trim() || '',
      strategyRule: values.strategyRule,
      creatorName: values.creator?.trim() || '',
      startTime: start ? start.format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: end ? end.format('YYYY-MM-DD HH:mm:ss') : '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      strategyName: '',
      channel: '',
      strategyRule: undefined,
      creatorName: '',
      startTime: '',
      endTime: '',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (page) => {
    setPagination({ current: page.current, size: page.pageSize });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await getConvStrategyPage({
        strategyName: filters.strategyName || undefined,
        channel: filters.channel || undefined,
        strategyRule: filters.strategyRule || undefined,
        creatorName: filters.creatorName || undefined,
        startTime: filters.startTime || undefined,
        endTime: filters.endTime || undefined,
        current: 1,
        size: 9999,
      });
      const allData = res?.data?.records || [];
      if (!allData.length) { message.warning('暂无数据可导出'); return; }
      const exportColumns = [
        { title: '策略ID', dataIndex: 'id' },
        { title: '策略名称', dataIndex: 'strategyName' },
        { title: '应用渠道', dataIndex: 'channel' },
        { title: '渠道编码', dataIndex: 'bizNo' },
        { title: '策略模型', dataIndex: 'strategyRule' },
        { title: '回传比例', dataIndex: 'callbackRatio' },
        { title: '策略节点概览', dataIndex: 'nodeOverview' },
        { title: '广告商', dataIndex: 'adInfo' },
        { title: '策略监测链接', dataIndex: 'strategyParams' },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '提交时间', dataIndex: 'createdAt' },
      ];
      const formatted = allData.map((row) => ({
        ...row,
        id: String(row.id).padStart(4, '0'),
        callbackRatio: row.callbackRatio != null ? `${row.callbackRatio}%` : '',
        createdAt: row.createdAt ? formatDateTime(row.createdAt) : '',
      }));
      exportToExcel(formatted, exportColumns, '回传策略管理');
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
        <Form.Item label="策略名称" name="strategyName">
          <Input placeholder="请输入回传节点参数名称" allowClear />
        </Form.Item>
        <Form.Item label="应用渠道" name="channel">
          <Input placeholder="请输入应用渠道" allowClear />
        </Form.Item>
        <Form.Item label="策略规则" name="strategyRule">
          <Select
            placeholder="全部"
            allowClear
            options={[
              { label: '自定义模型', value: '自定义模型' },
              { label: '下载回传模型', value: '下载回传模型' },
              { label: '下载留存模型', value: '下载留存模型' },
              { label: 'AI投顾前置收费模型', value: 'AI投顾前置收费模型' },
              { label: '增值产品签约模型', value: '增值产品签约模型' },
              { label: '客户资产信息模型', value: '客户资产信息模型' },
            ]}
            style={{ width: 170 }}
          />
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
            <Button type="primary" onClick={() => navigate('/callback/strategy-management/create')}>
              + 新建策略
            </Button>
          </Space>
        </Form.Item>
      </Form>
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
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
        scroll={{ x: 2080 }}
      />
    </Card>
  );
}

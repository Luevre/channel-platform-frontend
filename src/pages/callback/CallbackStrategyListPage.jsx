import { Button, Card, DatePicker, Form, Input, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveConvStrategy, getConvStrategyPage } from '../../api/convStrategy';
import { formatDateTime } from '../../utils/format';

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
    { title: '业务编号', dataIndex: 'bizNo', width: 120 },
    { title: '策略规则', dataIndex: 'strategyRule', width: 110 },
    {
      title: '回传比例',
      dataIndex: 'callbackRatio',
      width: 90,
      render: (value) => (value != null ? `${value}%` : '-'),
    },
    { title: '广告商', dataIndex: 'adInfo', width: 90 },
    { title: '策略参数', dataIndex: 'strategyParams', width: 220 },
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
              { label: '下载回传模型', value: '下载回传模型' },
              { label: '下载留存模型', value: '下载留存模型' },
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
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
          <Button type="primary" onClick={() => navigate('/callback/strategy-management/create')}>
            + 新建策略
          </Button>
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
        scroll={{ x: 1860 }}
      />
    </Card>
  );
}

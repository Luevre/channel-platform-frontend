import { Button, Card, DatePicker, Form, Input, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callbackStrategies } from '../../mock/platformData';

const { RangePicker } = DatePicker;

export function CallbackStrategyListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    name: '',
    channel: '',
    creator: '',
    strategyRule: undefined,
  });

  const dataSource = useMemo(() => {
    return callbackStrategies.filter((item) => {
      const matchName = !filters.name || item.name.includes(filters.name);
      const matchChannel = !filters.channel || item.channel.includes(filters.channel);
      const matchCreator = !filters.creator || item.creator.includes(filters.creator);
      const matchRule = !filters.strategyRule || item.model === filters.strategyRule;
      return matchName && matchChannel && matchCreator && matchRule;
    });
  }, [filters]);

  const columns = [
    {
      title: '策略ID',
      dataIndex: 'id',
      width: 90,
      render: (value) => value.replace('strategy-', '000'),
    },
    {
      title: '策略名称',
      dataIndex: 'name',
      width: 170,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: '应用渠道', dataIndex: 'channel', width: 140 },
    { title: '业务编号', dataIndex: 'bizNo', width: 120 },
    { title: '策略规则', dataIndex: 'model', width: 110 },
    { title: '回传比例', dataIndex: 'ratio', width: 90 },
    { title: '策略节点', dataIndex: 'nodes', width: 240 },
    { title: '广告商', dataIndex: 'adInfo', width: 90 },
    { title: '策略参数', dataIndex: 'strategyParams', width: 220 },
    { title: '创建人', dataIndex: 'creator', width: 90 },
    { title: '提交时间', dataIndex: 'submittedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: () => (
        <Space size={8}>
          <Button type="link" className="table-action-button">
            编辑
          </Button>
          <Button type="link" className="table-action-button">
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
    setFilters({
      name: values.name?.trim() || '',
      channel: values.channel?.trim() || '',
      creator: values.creator?.trim() || '',
      strategyRule: values.strategyRule,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ name: '', channel: '', creator: '', strategyRule: undefined });
  };

  return (
    <Card bordered={false} className="page-card">
      <Form form={form} layout="inline" className="filter-form filter-form-stacked">
        <Form.Item label="策略名称" name="name">
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
        pagination={{
          total: 5133,
          pageSize: 20,
          showSizeChanger: false,
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
        scroll={{ x: 1860 }}
      />
    </Card>
  );
}

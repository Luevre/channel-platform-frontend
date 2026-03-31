import { Button, Card, DatePicker, Form, Input, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deliveryChannels,
  deliveryContents,
  deliveryLinks,
  deliveryModes,
} from '../../mock/platformData';

const { RangePicker } = DatePicker;

export function DeliveryLinkListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    name: '',
    channel: undefined,
    content: undefined,
    mode: undefined,
    creator: '',
  });

  const dataSource = useMemo(() => {
    return deliveryLinks.filter((item) => {
      const matchName = !filters.name || item.name.includes(filters.name);
      const matchChannel = !filters.channel || item.channel === filters.channel;
      const matchContent = !filters.content || item.content === filters.content;
      const matchMode = !filters.mode || item.mode === filters.mode;
      const matchCreator = !filters.creator || item.creator.includes(filters.creator);
      return matchName && matchChannel && matchContent && matchMode && matchCreator;
    });
  }, [filters]);

  const columns = [
    {
      title: '链接名称',
      dataIndex: 'name',
      width: 160,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: '投放渠道', dataIndex: 'channel', width: 90 },
    { title: '投放内容', dataIndex: 'content', width: 110 },
    { title: '投放推广模式', dataIndex: 'mode', width: 130 },
    { title: '短链状态', dataIndex: 'status', width: 90 },
    { title: '短链失效时间', dataIndex: 'shortLinkUpdatedAt', width: 170 },
    { title: '创建人', dataIndex: 'creator', width: 90 },
    { title: '提交时间', dataIndex: 'submittedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
      channel: values.channel,
      content: values.content,
      mode: values.mode,
      creator: values.creator?.trim() || '',
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      name: '',
      channel: undefined,
      content: undefined,
      mode: undefined,
      creator: '',
    });
  };

  return (
    <Card bordered={false} className="page-card">
      <Form form={form} layout="inline" className="filter-form filter-form-stacked">
        <Form.Item label="链接名称" name="name">
          <Input placeholder="请输入链接名称" allowClear />
        </Form.Item>
        <Form.Item label="投放渠道" name="channel">
          <Select
            placeholder="全部"
            allowClear
            options={deliveryChannels.map((item) => ({ label: item, value: item }))}
            style={{ width: 160 }}
          />
        </Form.Item>
        <Form.Item label="投放内容" name="content">
          <Select
            placeholder="全部"
            allowClear
            options={deliveryContents.map((item) => ({ label: item, value: item }))}
            style={{ width: 160 }}
          />
        </Form.Item>
        <Form.Item label="投放推广模式" name="mode">
          <Select
            placeholder="全部"
            allowClear
            options={deliveryModes.map((item) => ({ label: item, value: item }))}
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
          <Button type="primary" onClick={() => navigate('/delivery/link-management/create')}>
            + 新增投放链接
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
        scroll={{ x: 1400 }}
      />
    </Card>
  );
}

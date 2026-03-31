import { Button, Card, Form, Input, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callbackNodeCategories, callbackNodes } from '../../mock/platformData';

export function CallbackNodeListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    name: '',
    convType: '',
    category: undefined,
  });

  const dataSource = useMemo(() => {
    return callbackNodes.filter((item) => {
      const matchName = !filters.name || item.name.includes(filters.name);
      const matchConvType = !filters.convType || item.convType.includes(filters.convType);
      const matchCategory = !filters.category || item.category === filters.category;
      return matchName && matchConvType && matchCategory;
    });
  }, [filters]);

  const columns = [
    {
      title: '节点名',
      dataIndex: 'name',
      width: 110,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: <span className="nowrap-header">convType值</span>, dataIndex: 'convType', width: 96 },
    { title: '节点事件分类', dataIndex: 'category', width: 120 },
    { title: '节点事件说明', dataIndex: 'description', width: 420 },
    { title: '节点事件判断', dataIndex: 'judgeRule', width: 180 },
    { title: '创建人', dataIndex: 'creator', width: 90 },
    { title: '最近操作时间', dataIndex: 'updatedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="link"
            className="table-action-button"
            onClick={() => navigate(`/callback/node-management/edit?id=${record.id}`)}
          >
            编辑
          </Button>
          <Button type="link" className="table-action-button">
            归档
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters({
      name: values.name?.trim() || '',
      convType: values.convType?.trim() || '',
      category: values.category,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ name: '', convType: '', category: undefined });
  };

  return (
    <Card bordered={false} className="page-card">
      <div className="page-toolbar">
        <Form form={form} layout="inline" className="filter-form">
          <Form.Item label="回传节点名称" name="name">
            <Input placeholder="请输入回传节点参数名称" allowClear />
          </Form.Item>
          <Form.Item label="convType值" name="convType">
            <Input placeholder="请输入节点convType值" allowClear />
          </Form.Item>
          <Form.Item label="节点事件分类" name="category">
            <Select
              placeholder="全部"
              allowClear
              options={callbackNodeCategories.map((item) => ({ label: item, value: item }))}
              style={{ width: 180 }}
            />
          </Form.Item>
        </Form>
        <div className="toolbar-actions">
          <Space>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
          <Button type="primary" onClick={() => navigate('/callback/node-management/create')}>
            + 新增参数
          </Button>
        </div>
      </div>
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
        scroll={{ x: 1500 }}
      />
    </Card>
  );
}

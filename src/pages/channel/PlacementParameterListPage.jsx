import { Button, Card, Form, Input, Select, Space, Table } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parameterCategories, placementParameters } from '../../mock/platformData';

export function PlacementParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    nameCn: '',
    nameEn: '',
    category: undefined,
  });

  const filteredData = useMemo(() => {
    return placementParameters.filter((item) => {
      const matchNameCn = !filters.nameCn || item.nameCn.includes(filters.nameCn);
      const matchNameEn = !filters.nameEn || item.nameEn.includes(filters.nameEn);
      const matchCategory = !filters.category || item.category === filters.category;
      return matchNameCn && matchNameEn && matchCategory;
    });
  }, [filters]);

  const columns = [
    {
      title: '参数名_中文',
      dataIndex: 'nameCn',
      width: 130,
      render: (value, record) => (
        <Button
          type="link"
          className="table-action-button"
          onClick={() => navigate(`/channel/placement-params/view?id=${record.id}`)}
        >
          {value}
        </Button>
      ),
    },
    {
      title: '参数名_英文',
      dataIndex: 'nameEn',
      width: 140,
    },
    {
      title: '参数分类',
      dataIndex: 'category',
      width: 110,
    },
    {
      title: '参数应用',
      dataIndex: 'application',
    },
    {
      title: '参数管理员',
      dataIndex: 'manager',
      width: 100,
    },
    {
      title: '最近操作时间',
      dataIndex: 'updatedAt',
      width: 170,
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
          onClick={() => navigate(`/channel/placement-params/edit?id=${record.id}`)}
        >
          编辑
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters({
      nameCn: values.nameCn?.trim() || '',
      nameEn: values.nameEn?.trim() || '',
      category: values.category,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      nameCn: '',
      nameEn: '',
      category: undefined,
    });
  };

  return (
    <Card bordered={false} className="page-card">
      <div className="page-toolbar">
        <Form form={form} layout="inline" className="filter-form">
          <Form.Item label="参数名称" name="nameCn">
            <Input placeholder="请输入参数名称" allowClear />
          </Form.Item>
          <Form.Item label="参数名" name="nameEn">
            <Input placeholder="请输入参数名，支持中英文" allowClear />
          </Form.Item>
          <Form.Item label="参数分类" name="category">
            <Select
              placeholder="全部"
              allowClear
              options={parameterCategories.map((item) => ({ label: item, value: item }))}
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
          <Button type="primary" onClick={() => navigate('/channel/placement-params/create')}>
            + 新增参数
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{
          total: 5133,
          pageSize: 20,
          showSizeChanger: false,
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
        scroll={{ x: 1220 }}
      />
    </Card>
  );
}

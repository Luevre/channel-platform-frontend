import { Button, Card, Form, Input, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parameterCategories } from '../../mock/platformData';
import { getPlacementParamPage } from '../../api/placementParam';

export function PlacementParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    nameCn: '',
    nameEn: '',
    category: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 20 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        paramName: filters.nameCn || undefined,
        channelCode: filters.nameEn || undefined,
        status: filters.category || undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getPlacementParamPage(params);
      const records = res?.data?.records || [];
      const total = res?.data?.total || 0;
      setDataSource(records);
      setTotal(total);
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
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      nameCn: '',
      nameEn: '',
      category: undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page.current,
      size: page.pageSize,
    }));
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
        scroll={{ x: 1220 }}
      />
    </Card>
  );
}

import { Button, Card, Form, Input, Select, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlacementParamPage } from '../../api/placementParam';
import { formatDateTime } from '../../utils/format';

export function PlacementParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    paramName: '',
    paramKey: '',
    category: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { label: '场景参数', value: '场景参数' },
    { label: '人员参数', value: '人员参数' },
    { label: '活动参数', value: '活动参数' },
    { label: '产品参数', value: '产品参数' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        paramName: filters.paramName || undefined,
        paramKey: filters.paramKey || undefined,
        category: filters.category || undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getPlacementParamPage(params);
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
      title: '参数名_中文',
      dataIndex: 'paramName',
      width: 150,
      ellipsis: { showTitle: false },
      render: (value, record) => (
        <Tooltip title={value}>
          <Button
            type="link"
            className="table-action-button"
            onClick={() => navigate(`/channel/placement-params/view?id=${record.id}`)}
          >
            {value}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: '参数名_英文',
      dataIndex: 'paramKey',
      width: 160,
      ellipsis: { showTitle: true },
    },
    {
      title: '参数分类',
      dataIndex: 'category',
      width: 100,
      ellipsis: { showTitle: true },
    },
    {
      title: '参数应用',
      dataIndex: 'paramUsage',
      ellipsis: { showTitle: true },
    },
    {
      title: '参数管理员',
      dataIndex: 'manager',
      width: 110,
      ellipsis: { showTitle: true },
    },
    {
      title: '最近操作时间',
      dataIndex: 'updatedAt',
      width: 180,
      ellipsis: { showTitle: true },
      render: formatDateTime,
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
      paramName: values.paramName?.trim() || '',
      paramKey: values.paramKey?.trim() || '',
      category: values.category,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ paramName: '', paramKey: '', category: undefined });
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
          <Form.Item label="参数名称" name="paramName">
            <Input placeholder="请输入参数名称" allowClear />
          </Form.Item>
          <Form.Item label="参数名" name="paramKey">
            <Input placeholder="请输入参数名，支持中英文" allowClear />
          </Form.Item>
          <Form.Item label="参数分类" name="category">
            <Select
              placeholder="全部"
              allowClear
              options={categoryOptions}
              style={{ width: 180 }}
            />
          </Form.Item>
        </Form>
        <div className="toolbar-actions">
          <Space>
            <Button type="primary" onClick={handleSearch}>查询</Button>
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
        scroll={{ x: 900 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total,
          showSizeChanger: false,
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
      />
    </Card>
  );
}

import { Button, Card, Form, Input, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callbackNodeCategories } from '../../constants/convNode';
import { getConvNodePage } from '../../api/convNode';
import { formatDateTime } from '../../utils/format';

export function CallbackNodeListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    name: '',
    convType: '',
    category: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        nodeName: filters.name || undefined,
        convType: filters.convType ? Number(filters.convType) : undefined,
        eventCategory: filters.category || undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getConvNodePage(params);
      const records = res?.data?.records || [];
      const total = res?.data?.total || 0;
      
      setDataSource(records);
      setTotal(total);
    } finally {
      // 即使报错也结束 loading，错误交给全局拦截处理
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.current, pagination.size]);

  const columns = [
    {
      title: '节点名',
      dataIndex: 'nodeName',
      width: 110,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: <span className="nowrap-header">convType值</span>, dataIndex: 'convType', width: 96 },
    { title: '节点事件分类', dataIndex: 'eventCategory', width: 120 },
    { title: '节点事件说明', dataIndex: 'eventDesc', width: 420 },
    { title: '节点事件判断', dataIndex: 'eventJudge', width: 180 },
    { title: '创建人', dataIndex: 'creatorName', width: 90 },
    { title: '最近操作时间', dataIndex: 'updatedAt', width: 170, render: formatDateTime },
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
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ name: '', convType: '', category: undefined });
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
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total,
          showSizeChanger: false,
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
        scroll={{ x: 1500 }}
      />
    </Card>
  );
}

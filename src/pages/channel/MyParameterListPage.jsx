import { Button, Card, Form, Input, Select, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { archiveMyParameter, getMyParameterPage, submitMyParameter } from '../../api/myParameter';

export function MyParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    scene: '',
    value: '',
    parameterName: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 20 });
  const [loading, setLoading] = useState(false);

  const parameterOptions = [
    { label: '全部', value: '' },
    { label: 'channel_type | 渠道编码', value: 'channel_type | 渠道编码' },
    { label: 'employee_id | 员工工号', value: 'employee_id | 员工工号' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        scene: filters.scene || undefined,
        value: filters.value || undefined,
        parameterName: filters.parameterName || undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getMyParameterPage(params);
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
      title: '参数应用场景',
      dataIndex: 'scene',
      width: 130,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    {
      title: '参数值',
      dataIndex: 'value',
      width: 130,
    },
    {
      title: '参数名',
      dataIndex: 'parameterName',
      width: 180,
    },
    {
      title: '参数使用说明',
      dataIndex: 'usage',
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      width: 90,
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      width: 170,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="link"
            className="table-action-button"
            onClick={() => navigate(`/channel/my-params/review?id=${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            className="table-action-button"
            onClick={async () => {
              await submitMyParameter(record.id);
              message.success('已提交');
              fetchData();
            }}
          >
            提交
          </Button>
          <Button
            type="link"
            className="table-action-button"
            onClick={async () => {
              await archiveMyParameter(record.id);
              message.info('已归档');
              fetchData();
            }}
          >
            归档
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters({
      scene: values.scene?.trim() || '',
      value: values.value?.trim() || '',
      parameterName: values.parameterName || undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      scene: '',
      value: '',
      parameterName: undefined,
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
          <Form.Item label="参数应用渠道" name="scene">
            <Input placeholder="请输入参数应用场景" allowClear />
          </Form.Item>
          <Form.Item label="参数值" name="value">
            <Input placeholder="请输入参数值" allowClear />
          </Form.Item>
          <Form.Item label="参数名" name="parameterName">
            <Select placeholder="全部" allowClear options={parameterOptions} style={{ width: 180 }} />
          </Form.Item>
        </Form>
        <div className="toolbar-actions">
          <Space>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
          <Button type="primary" onClick={() => navigate('/channel/my-params/create')}>
            + 添加我的参数
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
        scroll={{ x: 1180 }}
      />
    </Card>
  );
}

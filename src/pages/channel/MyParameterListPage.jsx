import { Button, Card, Form, Input, Select, Space, Table, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { myParameters } from '../../mock/platformData';

export function MyParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    scene: '',
    value: '',
    parameterName: undefined,
  });

  const parameterOptions = [
    { label: '全部', value: '' },
    { label: 'channel_type | 渠道编码', value: 'channel_type | 渠道编码' },
    { label: 'employee_id | 员工工号', value: 'employee_id | 员工工号' },
  ];

  const dataSource = useMemo(() => {
    return myParameters.filter((item) => {
      const matchScene = !filters.scene || item.scene.includes(filters.scene);
      const matchValue = !filters.value || item.value.includes(filters.value);
      const matchName = !filters.parameterName || item.parameterName === filters.parameterName;
      return matchScene && matchValue && matchName;
    });
  }, [filters]);

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
          <Button type="link" className="table-action-button" onClick={() => message.success('已提交（Mock）')}>
            提交
          </Button>
          <Button type="link" className="table-action-button" onClick={() => message.info('已归档（Mock）')}>
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
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      scene: '',
      value: '',
      parameterName: undefined,
    });
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
        pagination={{
          total: 5133,
          pageSize: 20,
          showSizeChanger: false,
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
        scroll={{ x: 1180 }}
      />
    </Card>
  );
}

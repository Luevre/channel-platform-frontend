import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placementReviews, reviewStatusOptions } from '../../mock/platformData';

const { RangePicker } = DatePicker;

export function PlacementReviewListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    scene: '',
    value: '',
    applicant: '',
    parameterName: undefined,
    status: undefined,
  });

  const dataSource = useMemo(() => {
    return placementReviews.filter((item) => {
      const matchScene = !filters.scene || item.scene.includes(filters.scene);
      const matchValue = !filters.value || item.value.includes(filters.value);
      const matchApplicant = !filters.applicant || item.applicant.includes(filters.applicant);
      const matchName = !filters.parameterName || item.parameterName.includes(filters.parameterName);
      const matchStatus = !filters.status || item.status === filters.status;
      return matchScene && matchValue && matchApplicant && matchName && matchStatus;
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
    { title: '参数值', dataIndex: 'value', width: 130 },
    { title: '参数名', dataIndex: 'parameterName', width: 180 },
    { title: '参数使用说明', dataIndex: 'usage' },
    { title: '申请人', dataIndex: 'applicant', width: 90 },
    { title: '提交时间', dataIndex: 'submittedAt', width: 170 },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => <Tag color={value === '待审核' ? 'gold' : 'blue'}>{value}</Tag>,
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
          onClick={() => navigate(`/channel/placement-review/detail?id=${record.id}`)}
        >
          {record.status === '待审核' ? '审核' : '查阅'}
        </Button>
      ),
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters({
      scene: values.scene?.trim() || '',
      value: values.value?.trim() || '',
      applicant: values.applicant?.trim() || '',
      parameterName: values.parameterName,
      status: values.status,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      scene: '',
      value: '',
      applicant: '',
      parameterName: undefined,
      status: undefined,
    });
  };

  return (
    <Card bordered={false} className="page-card">
      <Form form={form} layout="inline" className="filter-form filter-form-stacked">
        <Form.Item label="参数应用渠道" name="scene">
          <Input placeholder="请输入参数名称" allowClear />
        </Form.Item>
        <Form.Item label="参数值" name="value">
          <Input placeholder="请输入参数值" allowClear />
        </Form.Item>
        <Form.Item label="参数名" name="parameterName">
          <Select
            placeholder="全部"
            allowClear
            options={[
              { label: '全部', value: '' },
              { label: 'channel_type | 渠道编码', value: 'channel_type' },
              { label: 'employee_id | 员工工号', value: 'employee_id' },
            ]}
            style={{ width: 170 }}
          />
        </Form.Item>
        <Form.Item label="审核状态" name="status">
          <Select
            placeholder="全部"
            allowClear
            options={reviewStatusOptions.map((item) => ({ label: item, value: item }))}
            style={{ width: 160 }}
          />
        </Form.Item>
        <Form.Item label="申请人" name="applicant">
          <Input placeholder="请输入申请人名称" allowClear />
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
        scroll={{ x: 1320 }}
      />
    </Card>
  );
}

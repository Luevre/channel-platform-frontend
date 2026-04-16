import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyParameterPage } from '../../api/myParameter';
import { formatDateTime } from '../../utils/format';

const { RangePicker } = DatePicker;

const AUDIT_RESULT_MAP = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'blue' },
  2: { label: '已驳回', color: 'red' },
};

export function PlacementReviewListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const params = {
        current: page,
        size: 10,
        scene: values.scene?.trim() || undefined,
        value: values.value?.trim() || undefined,
        applicant: values.applicant?.trim() || undefined,
        parameterName: values.parameterName || undefined,
        status: 1, // 只查已提交的记录（待审核池）
      };
      const res = await getMyParameterPage(params);
      if (res.data) {
        setDataSource(res.data.records || []);
        setTotal(res.data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, []);

  const columns = [
    {
      title: '参数应用场景',
      dataIndex: 'scene',
      width: 130,
      render: (value) => (
        <Button type="link" className="table-action-button">{value}</Button>
      ),
    },
    { title: '参数值', dataIndex: 'value', width: 130 },
    { title: '参数名', dataIndex: 'parameterName', width: 180 },
    { title: '参数使用说明', dataIndex: 'usage' },
    { title: '申请人', dataIndex: 'applicant', width: 90 },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      width: 170,
      render: formatDateTime,
    },
    {
      title: '审核状态',
      dataIndex: 'auditResult',
      width: 100,
      render: (val) => {
        const s = AUDIT_RESULT_MAP[val ?? 0];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
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
          {record.auditResult === 0 ? '审核' : '查阅'}
        </Button>
      ),
    },
  ];

  const handleSearch = () => { setCurrent(1); fetchData(1); };
  const handleReset = () => { form.resetFields(); setCurrent(1); fetchData(1); };

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
          <Select placeholder="全部" allowClear
            options={[
              { label: 'channel_type | 渠道编码', value: 'channel_type' },
              { label: 'employee_id | 员工工号', value: 'employee_id' },
            ]}
            style={{ width: 170 }}
          />
        </Form.Item>
        <Form.Item label="审核状态" name="auditResult">
          <Select placeholder="全部" allowClear
            options={[
              { label: '待审核', value: 0 },
              { label: '已通过', value: 1 },
              { label: '已驳回', value: 2 },
            ]}
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
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current,
          total,
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (t, range) => `当前第${range[0]}-${range[1]}条 总计${t}条`,
          onChange: (page) => { setCurrent(page); fetchData(page); },
        }}
        scroll={{ x: 1320 }}
      />
    </Card>
  );
}

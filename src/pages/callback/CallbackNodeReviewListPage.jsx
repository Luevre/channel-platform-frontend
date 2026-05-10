import { Button, Card, Form, Input, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { callbackNodeCategories } from '../../constants/convNode';
import { getMyConvNodePage } from '../../api/myConvNode';
import { formatDateTime } from '../../utils/format';

const AUDIT_RESULT_MAP = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'blue' },
  2: { label: '已驳回', color: 'red' },
};

export function CallbackNodeReviewListPage() {
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
        nodeName: values.nodeName?.trim() || undefined,
        convType: values.convType?.trim() ? Number(values.convType.trim()) : undefined,
        eventCategory: values.eventCategory || undefined,
        status: 1, // 只查已提交的记录（待审核池）
      };
      const res = await getMyConvNodePage(params);
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
      title: '节点名',
      dataIndex: 'nodeName',
      width: 130,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: <span className="nowrap-header">convType值</span>, dataIndex: 'convType', width: 96 },
    { title: '节点事件分类', dataIndex: 'eventCategory', width: 120 },
    { title: '节点事件说明', dataIndex: 'eventDesc' },
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
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" className="table-action-button">
            编辑
          </Button>
          <Button type="link" className="table-action-button">
            归档
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = () => { setCurrent(1); fetchData(1); };
  const handleReset = () => { form.resetFields(); setCurrent(1); fetchData(1); };

  return (
    <Card bordered={false} className="page-card">
      <Form form={form} layout="inline" className="filter-form filter-form-stacked">
        <Form.Item label="回传节点名称" name="nodeName">
          <Input placeholder="请输入回传节点参数名称" allowClear />
        </Form.Item>
        <Form.Item label="convType值" name="convType">
          <Input placeholder="请输入节点convType值" allowClear />
        </Form.Item>
        <Form.Item label="节点事件分类" name="eventCategory">
          <Select
            placeholder="全部"
            allowClear
            options={callbackNodeCategories.map((item) => ({ label: item, value: item }))}
            style={{ width: 180 }}
          />
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
        scroll={{ x: 1200 }}
      />
    </Card>
  );
}

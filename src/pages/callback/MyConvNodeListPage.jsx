import { Button, Card, Form, Input, Select, Space, Table, Tag, Tooltip, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { callbackNodeCategories } from '../../constants/convNode';
import { archiveMyConvNode, getMyConvNodePage, submitMyConvNode } from '../../api/myConvNode';
import { formatDateTime } from '../../utils/format';
import { exportToExcel } from '../../utils/exportExcel';

const AUDIT_MAP = {
  0: { label: '待审核', color: 'default' },
  1: { label: '已通过', color: 'success' },
  2: { label: '已驳回', color: 'error' },
};

export function MyConvNodeListPage() {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    nodeName: '',
    convType: '',
    eventCategory: undefined,
    auditResult: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        nodeName: filters.nodeName || undefined,
        convType: filters.convType ? Number(filters.convType) : undefined,
        eventCategory: filters.eventCategory || undefined,
        auditResult: filters.auditResult != null ? filters.auditResult : undefined,
        current: pagination.current,
        size: pagination.size,
      };
      const res = await getMyConvNodePage(params);
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
      title: '节点名',
      dataIndex: 'nodeName',
      width: 130,
      render: (value) => (
        <Button type="link" className="table-action-button">
          {value}
        </Button>
      ),
    },
    { title: <span className="nowrap-header">convType值</span>, dataIndex: 'convType', width: 110 },
    { title: '节点事件分类', dataIndex: 'eventCategory', width: 130 },
    { title: '节点事件说明', dataIndex: 'eventDesc' },
    {
      title: '审核状态',
      dataIndex: 'auditResult',
      width: 90,
      render: (val) => {
        const a = AUDIT_MAP[val] ?? { label: '待审核', color: 'default' };
        return <Tag color={a.color}>{a.label}</Tag>;
      },
    },
    { title: '申请人', dataIndex: 'applicant', width: 80 },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      width: 160,
      render: formatDateTime,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => {
        const isDraft = record.status === 0;
        return (
          <Space size={8}>
            <Button
              type="link"
              className="table-action-button"
              disabled={!isDraft}
              onClick={() => navigate(`/callback/my-node/edit?id=${record.id}`)}
            >
              编辑
            </Button>
            <Button
              type="link"
              className="table-action-button"
              disabled={!isDraft}
              onClick={async () => {
                try {
                  await submitMyConvNode(record.id);
                  message.success('已提交');
                  fetchData();
                } catch {
                  message.error('提交失败');
                }
              }}
            >
              提交
            </Button>
            <Button
              type="link"
              className="table-action-button"
              disabled={record.status === 2}
              onClick={async () => {
                try {
                  await archiveMyConvNode(record.id);
                  message.info('已归档');
                  fetchData();
                } catch {
                  message.error('归档失败');
                }
              }}
            >
              归档
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters({
      nodeName: values.nodeName?.trim() || '',
      convType: values.convType?.trim() || '',
      eventCategory: values.eventCategory || undefined,
      auditResult: values.auditResult != null ? values.auditResult : undefined,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ nodeName: '', convType: '', eventCategory: undefined, auditResult: undefined });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page.current,
      size: page.pageSize,
    }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await getMyConvNodePage({
        nodeName: filters.nodeName || undefined,
        convType: filters.convType ? Number(filters.convType) : undefined,
        eventCategory: filters.eventCategory || undefined,
        auditResult: filters.auditResult != null ? filters.auditResult : undefined,
        current: 1,
        size: 9999,
      });
      const allData = res?.data?.records || [];
      if (!allData.length) { message.warning('暂无数据可导出'); return; }
      const exportColumns = [
        { title: '节点名', dataIndex: 'nodeName' },
        { title: 'convType值', dataIndex: 'convType' },
        { title: '节点事件分类', dataIndex: 'eventCategory' },
        { title: '节点事件说明', dataIndex: 'eventDesc' },
        { title: '审核状态', dataIndex: 'auditResult' },
        { title: '申请人', dataIndex: 'applicant' },
        { title: '提交时间', dataIndex: 'submittedAt' },
      ];
      const AUDIT_LABEL = { 0: '待审核', 1: '已通过', 2: '已驳回' };
      const formatted = allData.map((row) => ({
        ...row,
        auditResult: AUDIT_LABEL[row.auditResult] ?? '待审核',
        submittedAt: row.submittedAt ? formatDateTime(row.submittedAt) : '',
      }));
      exportToExcel(formatted, exportColumns, '我的回传节点');
      message.success(`已导出 ${allData.length} 条数据`);
    } catch {
      message.error('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card bordered={false} className="page-card">
      <div className="page-toolbar">
        <Form form={form} layout="inline" className="filter-form">
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
          <Form.Item label="审核状态" name="auditResult">
            <Select placeholder="全部" allowClear style={{ width: 140 }} options={[
              { label: '待审核', value: 0 },
              { label: '已通过', value: 1 },
              { label: '已驳回', value: 2 },
            ]} />
          </Form.Item>
        </Form>
        <div className="toolbar-actions">
          <Space>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />} loading={exporting} onClick={handleExport}>
              导出 Excel
            </Button>
            <Button type="primary" onClick={() => navigate('/callback/my-node/create')}>
              + 新增参数
            </Button>
          </Space>
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
          showTotal: (t, range) => `当前第${range[0]}-${range[1]}条 总计${t}条`,
        }}
      />
    </Card>
  );
}

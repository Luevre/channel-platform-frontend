import { Button, Card, Form, Input, Select, Space, Table, Tooltip } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlacementParamPage } from '../../api/placementParam';
import { formatDateTime } from '../../utils/format';

/** 根据可视区高度动态计算每页条数 */
function useAutoPageSize(cardRef, defaultSize = 10) {
  const [pageSize, setPageSize] = useState(defaultSize);

  const calc = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    // 表格容器（ant-table-wrapper）的可用高度
    const wrapper = el.querySelector('.ant-table-wrapper');
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const headerHeight = 55;  // 表头高度
    const paginationHeight = 56; // 分页栏高度
    const availableHeight = wrapperRect.height - headerHeight - paginationHeight;
    // 行高估算：普通行约 55px，带换行的约 80px，取平均 65px
    const estimatedRowHeight = 65;
    const newSize = Math.max(5, Math.floor(availableHeight / estimatedRowHeight));
    setPageSize(newSize);
  }, [cardRef]);

  useEffect(() => {
    // 初始计算 + 延迟一帧等待渲染完成
    const timer = setTimeout(calc, 100);
    window.addEventListener('resize', calc);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calc);
    };
  }, [calc]);

  return pageSize;
}

export function PlacementParameterListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const cardRef = useRef(null);
  const autoPageSize = useAutoPageSize(cardRef);
  const [filters, setFilters] = useState({
    paramName: '',
    paramKey: '',
    category: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
        current: currentPage,
        size: autoPageSize,
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
  }, [filters, currentPage, autoPageSize]);

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
      onCell: () => ({ className: 'cell-wrap' }),
    },
    {
      title: '参数管理员',
      dataIndex: 'manager',
      width: 110,
      ellipsis: { showTitle: true },
      render: (value) =>
        value ? (
          <Button type="link" className="table-action-button">
            {value}
          </Button>
        ) : (
          '-'
        ),
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
    setCurrentPage(1);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({ paramName: '', paramKey: '', category: undefined });
    setCurrentPage(1);
  };

  const handleTableChange = (page) => {
    setCurrentPage(page.current);
  };

  return (
    <Card bordered={false} className="page-card" ref={cardRef}>
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
          current: currentPage,
          pageSize: autoPageSize,
          total,
          showSizeChanger: false,
          showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 总计${total}条`,
        }}
      />
    </Card>
  );
}

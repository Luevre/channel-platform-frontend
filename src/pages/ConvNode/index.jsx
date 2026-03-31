import { useState, useEffect, useRef } from 'react'
import {
  Table, Button, Input, Select, Space, Form,
  Modal, message, Popconfirm, Tag
} from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import {
  getConvNodePage, createConvNode,
  updateConvNode, deleteConvNode, archiveConvNode
} from '../../api/convNode'

// =============================================
// 回传节点管理页面（完整联动版）
// 放到 src/pages/ConvNode/index.jsx
// 替换掉你原来用 mock 数据的版本
// =============================================

const { Option } = Select

// 节点事件分类选项（对应后端数据）
const EVENT_CATEGORIES = ['下载开户节点', '活动节点', 'AI投顾节点']

export default function ConvNodePage() {
  const [loading, setLoading]   = useState(false)
  const [data, setData]         = useState([])
  const [total, setTotal]       = useState(0)
  const [current, setCurrent]   = useState(1)
  const [pageSize]              = useState(20)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // 搜索条件
  const [searchNodeName, setSearchNodeName]       = useState('')
  const [searchConvType, setSearchConvType]       = useState('')
  const [searchCategory, setSearchCategory]       = useState(undefined)

  const [form] = Form.useForm()

  // ---- 查询 ----
  const fetchData = async (page = current) => {
    setLoading(true)
    try {
      const res = await getConvNodePage({
        current: page,
        size: pageSize,
        nodeName:      searchNodeName  || undefined,
        convType:      searchConvType  !== '' ? searchConvType : undefined,
        eventCategory: searchCategory  || undefined,
      })
      setData(res.data.records)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(1) }, [])

  const handleSearch = () => { setCurrent(1); fetchData(1) }
  const handleReset  = () => {
    setSearchNodeName(''); setSearchConvType(''); setSearchCategory(undefined)
    setCurrent(1)
    // 重置后立即查询全量
    setTimeout(() => fetchData(1), 0)
  }

  // ---- 新增 / 编辑 ----
  const openCreate = () => {
    setEditingId(null)
    form.resetFields()
    setModalOpen(true)
  }
  const openEdit = async (record) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalOpen(true)
  }
  const handleSubmit = async () => {
    let values
    try { values = await form.validateFields() } catch { return }
    setSubmitLoading(true)
    try {
      if (editingId) {
        await updateConvNode(editingId, values)
        message.success('编辑成功')
      } else {
        await createConvNode(values)
        message.success('新增成功')
      }
      setModalOpen(false)
      fetchData(current)
    } finally {
      setSubmitLoading(false)
    }
  }

  // ---- 删除 / 归档 ----
  const handleDelete = async (id) => {
    await deleteConvNode(id)
    message.success('删除成功')
    fetchData(current)
  }
  const handleArchive = async (id) => {
    await archiveConvNode(id)
    message.success('已归档')
    fetchData(current)
  }

  // ---- 表格列定义 ----
  const columns = [
    {
      title: '节点名', dataIndex: 'nodeName', width: 140,
      render: (text, record) => (
        <a onClick={() => openEdit(record)} style={{ color: '#1677ff' }}>{text}</a>
      )
    },
    { title: 'convType值', dataIndex: 'convType', width: 100 },
    {
      title: '节点事件分类', dataIndex: 'eventCategory', width: 130,
      render: (v) => <Tag color="blue">{v}</Tag>
    },
    { title: '节点事件说明', dataIndex: 'eventDesc', ellipsis: true },
    { title: '节点事件判断', dataIndex: 'eventJudge', width: 160, ellipsis: true },
    { title: '创建人', dataIndex: 'creatorName', width: 90 },
    {
      title: '最近操作时间', dataIndex: 'updatedAt', width: 160,
      render: (v) => v ? v.replace('T', ' ').substring(0, 19) : '-'
    },
    {
      title: '操作', width: 110, fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确认归档？" onConfirm={() => handleArchive(record.id)}>
            <Button type="link" size="small">归档</Button>
          </Popconfirm>
        </Space>
      )
    },
  ]

  return (
    <div className="page-card" style={{ padding: 24 }}>
      {/* 搜索栏 */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="回传节点名称"
          value={searchNodeName}
          onChange={e => setSearchNodeName(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Input
          placeholder="节点convType值"
          value={searchConvType}
          onChange={e => setSearchConvType(e.target.value)}
          style={{ width: 160 }}
          allowClear
        />
        <Select
          placeholder="节点事件分类：全部"
          value={searchCategory}
          onChange={setSearchCategory}
          style={{ width: 180 }}
          allowClear
        >
          {EVENT_CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
        </Select>
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>+ 新增参数</Button>
      </Space>

      {/* 表格 */}
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1000 }}
        pagination={{
          current,
          pageSize,
          total,
          showTotal: (t, r) => `当前第${r[0]}-${r[1]}条 共${t}条`,
          onChange: (page) => { setCurrent(page); fetchData(page) }
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingId ? '编辑回传节点' : '新增回传节点'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitLoading}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="nodeName" label="节点名" rules={[{ required: true }]}>
            <Input placeholder="如：APP下载" />
          </Form.Item>
          <Form.Item name="convType" label="convType值" rules={[{ required: true }]}>
            <Input type="number" placeholder="如：0" />
          </Form.Item>
          <Form.Item name="eventCategory" label="节点事件分类" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              {EVENT_CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="eventDesc" label="节点事件说明">
            <Input.TextArea rows={2} placeholder="事件说明" />
          </Form.Item>
          <Form.Item name="eventJudge" label="节点事件判断">
            <Input placeholder="如：客户端finder" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

import { CheckOutlined, CloseOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button, Card, Checkbox, Collapse, Form, Input, Modal,
  Select, Space, Table, message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  createContent, createDeliveryLink, createPlatform, createPosition,
  deleteContent, deletePlatform, deletePosition,
  getContents, getDeliveryLinkById, getPlatforms,
  updateContent, updateDeliveryLink, updatePlatform, updatePosition,
} from '../../api/deliveryLink';

const PROMO_MODES = ['网销线上推广', '网金线下推广', '网销线下推广'];

const PARAM_GROUPS = [
  {
    group: '场景参数',
    options: [
      { label: 'channel_type | 渠道编码', value: 'channel_type' },
      { label: 'biz_type | 注册用户业务来源', value: 'biz_type' },
      { label: 'entrance_type | AI签约入口参数', value: 'entrance_type' },
    ],
  },
  {
    group: '活动参数',
    options: [
      { label: 'activity_no | 活动编号', value: 'activity_no' },
      { label: 'activity_id | 营销活动编号', value: 'activity_id' },
    ],
  },
  {
    group: '产品参数',
    options: [
      { label: 'tabKey | AI投顾产品编号', value: 'tabKey' },
      { label: 'btgpjt | 产品二选开关', value: 'btgpjt' },
    ],
  },
  {
    group: '人员参数',
    options: [
      { label: 'employee_id | 员工工号', value: 'employee_id' },
      { label: 'recommend_code | 推荐人', value: 'recommend_code' },
    ],
  },
];

const ALL_OPTIONS = PARAM_GROUPS.flatMap((g) => g.options);

export function DeliveryLinkFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = useMemo(() => searchParams.get('id'), [searchParams]);
  const isEdit = mode === 'edit';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultVO, setResultVO] = useState(null);

  const [newContentName, setNewContentName] = useState('');
  const [editingContent, setEditingContent] = useState(null);

  const [newPlatformName, setNewPlatformName] = useState('');
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [newPositionPlatformId, setNewPositionPlatformId] = useState(null);
  const [newPositionName, setNewPositionName] = useState('');
  const [editingPosition, setEditingPosition] = useState(null);

  const [selectedParams, setSelectedParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [paramSearch, setParamSearch] = useState('');

  const filteredGroups = useMemo(() => {
    if (!paramSearch.trim()) return PARAM_GROUPS;
    const kw = paramSearch.trim().toLowerCase();
    return PARAM_GROUPS.map((g) => ({
      ...g,
      options: g.options.filter((o) => o.label.toLowerCase().includes(kw) || o.value.toLowerCase().includes(kw)),
    })).filter((g) => g.options.length > 0);
  }, [paramSearch]);

  const fetchContents = () => getContents().then((res) => setContents(res?.data || []));
  const fetchPlatforms = () => getPlatforms().then((res) => setPlatforms(res?.data || []));

  useEffect(() => {
    fetchContents();
    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (!isEdit || !linkId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getDeliveryLinkById(linkId);
        const record = res?.data;
        if (cancelled || !record) return;
        form.setFieldsValue({
          linkName: record.linkName,
          channel: record.channel,
          content: record.content,
          promoMode: record.promoMode,
          originUrl: record.originUrl,
        });
        if (record.paramsJson) {
          try {
            const parsed = JSON.parse(record.paramsJson);
            setSelectedParams(Object.keys(parsed));
            setParamValues(parsed);
          } catch (_) {}
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, linkId]); // eslint-disable-line

  const handleFinish = async (values) => {
    const params = {};
    selectedParams.forEach((key) => { params[key] = paramValues[key] || ''; });
    const data = {
      linkName: values.linkName?.trim(),
      channel: values.channel,
      content: values.content,
      promoMode: values.promoMode,
      originUrl: values.originUrl?.trim(),
      params,
    };
    setLoading(true);
    try {
      if (isEdit) {
        await updateDeliveryLink(linkId, data);
        message.success('编辑成功');
        navigate('/delivery/link-management');
      } else {
        const res = await createDeliveryLink(data);
        setResultVO(res?.data);
        setResultModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => message.success('已复制'));
  };

  // 内容弹窗
  const handleCreateContent = async () => {
    if (!newContentName.trim()) return;
    await createContent(newContentName.trim());
    setNewContentName('');
    fetchContents();
  };

  const handleUpdateContent = async () => {
    if (!editingContent?.name.trim()) return;
    await updateContent(editingContent.id, editingContent.name.trim());
    setEditingContent(null);
    fetchContents();
  };

  const handleDeleteContent = (id) => {
    Modal.confirm({
      title: '确定要删除？',
      content: '删除不影响历史投放数据，但投放参数将不可再恢复使用，确定要删除？',
      okText: '确定删除', okButtonProps: { danger: true }, cancelText: '我再想想',
      onOk: () => deleteContent(id).then(fetchContents),
    });
  };

  const contentColumns = [
    {
      title: '投放内容', dataIndex: 'name',
      render: (value, record) =>
        editingContent?.id === record.id ? (
          <Input value={editingContent.name} size="small"
            onChange={(e) => setEditingContent({ ...editingContent, name: e.target.value })} />
        ) : value,
    },
    {
      title: '操作', key: 'action', width: 120,
      render: (_, record) =>
        editingContent?.id === record.id ? (
          <Space size={4}>
            <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />} onClick={handleUpdateContent} />
            <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => setEditingContent(null)} />
          </Space>
        ) : (
          <Space size={8}>
            <Button type="link" className="table-action-button"
              onClick={() => setEditingContent({ id: record.id, name: record.name })}>编辑</Button>
            <Button type="link" className="table-action-button" danger
              onClick={() => handleDeleteContent(record.id)}>删除</Button>
          </Space>
        ),
    },
  ];

  // 平台弹窗
  const handleCreatePlatform = async () => {
    if (!newPlatformName.trim()) return;
    await createPlatform(newPlatformName.trim());
    setNewPlatformName('');
    fetchPlatforms();
  };

  const handleDeletePlatform = (id) => {
    Modal.confirm({
      title: '确定要删除？',
      content: '删除不影响历史投放数据，但投放参数将不可再恢复使用，确定要删除？',
      okText: '确定删除', okButtonProps: { danger: true }, cancelText: '我再想想',
      onOk: () => deletePlatform(id).then(fetchPlatforms),
    });
  };

  const handleCreatePosition = async (platformId) => {
    if (!newPositionName.trim()) return;
    await createPosition(platformId, newPositionName.trim());
    setNewPositionPlatformId(null);
    setNewPositionName('');
    fetchPlatforms();
  };

  const handleDeletePosition = (id) => {
    Modal.confirm({
      title: '确定要删除？',
      content: '删除不影响历史投放数据，但投放参数将不可再恢复使用，确定要删除？',
      okText: '确定删除', okButtonProps: { danger: true }, cancelText: '我再想想',
      onOk: () => deletePosition(id).then(fetchPlatforms),
    });
  };

  const platformColumns = [
    {
      title: '投放平台', dataIndex: 'name',
      render: (value, record) =>
        editingPlatform?.id === record.id ? (
          <Input value={editingPlatform.name} size="small"
            onChange={(e) => setEditingPlatform({ ...editingPlatform, name: e.target.value })} />
        ) : value,
    },
    {
      title: '平台位置', dataIndex: 'positions',
      render: (v) => v?.map((p) => p.name).join('、') || '未配置',
    },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" className="table-action-button"
            onClick={() => { setNewPositionPlatformId(record.id); setNewPositionName(''); }}>
            新增位置
          </Button>
          {editingPlatform?.id === record.id ? (
            <>
              <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />}
                onClick={() => updatePlatform(record.id, editingPlatform.name)
                  .then(() => { setEditingPlatform(null); fetchPlatforms(); })} />
              <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />}
                onClick={() => setEditingPlatform(null)} />
            </>
          ) : (
            <>
              <Button type="link" className="table-action-button"
                onClick={() => setEditingPlatform({ id: record.id, name: record.name })}>编辑</Button>
              <Button type="link" className="table-action-button" danger
                onClick={() => handleDeletePlatform(record.id)}>删除</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <div style={{ paddingLeft: 24 }}>
      {record.positions?.map((pos) => (
        <div key={pos.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
          {editingPosition?.id === pos.id ? (
            <>
              <Input value={editingPosition.name} size="small" style={{ width: 160 }}
                onChange={(e) => setEditingPosition({ ...editingPosition, name: e.target.value })} />
              <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />}
                onClick={() => updatePosition(pos.id, editingPosition.name)
                  .then(() => { setEditingPosition(null); fetchPlatforms(); })} />
              <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />}
                onClick={() => setEditingPosition(null)} />
            </>
          ) : (
            <>
              <span style={{ width: 160 }}>{pos.name}</span>
              <Button type="link" className="table-action-button"
                onClick={() => setEditingPosition({ id: pos.id, name: pos.name })}>编辑</Button>
              <Button type="link" className="table-action-button" danger
                onClick={() => handleDeletePosition(pos.id)}>删除</Button>
            </>
          )}
        </div>
      ))}
      {newPositionPlatformId === record.id && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
          <Input placeholder="请输入平台位置名称" size="small" style={{ width: 160 }}
            value={newPositionName} onChange={(e) => setNewPositionName(e.target.value)} />
          <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />}
            onClick={() => handleCreatePosition(record.id)} />
          <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />}
            onClick={() => setNewPositionPlatformId(null)} />
        </div>
      )}
    </div>
  );

  return (
    <>
      <Card bordered={false} className="page-card form-page-card">
        <div className="page-form-title">{isEdit ? '编辑投放链接' : '新增投放链接'}</div>
        <Form form={form} layout="vertical" className="form-page" onFinish={handleFinish}>
          <Form.Item label="投放名称" name="linkName" rules={[{ required: true, message: '请输入投放名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item label="投放渠道" name="channel" rules={[{ required: true, message: '请选择投放渠道' }]}>
            <Select
              placeholder="请选择投放渠道"
              options={platforms.map((p) => ({ label: p.name, value: p.name }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="dropdown-setting-link">
                    <Button type="link" className="table-action-button"
                      onClick={() => setPlatformModalOpen(true)}>平台设置</Button>
                  </div>
                </>
              )}
            />
          </Form.Item>

          <Form.Item label="投放内容" name="content" rules={[{ required: true, message: '请选择投放内容' }]}>
            <Select
              placeholder="请选择投放内容"
              options={contents.map((c) => ({ label: c.name, value: c.name }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="dropdown-setting-link">
                    <Button type="link" className="table-action-button"
                      onClick={() => setContentModalOpen(true)}>内容设置</Button>
                  </div>
                </>
              )}
            />
          </Form.Item>

          <Form.Item label="推广模式" name="promoMode" rules={[{ required: true, message: '请选择推广模式' }]}>
            <Select placeholder="请选择推广模式"
              options={PROMO_MODES.map((m) => ({ label: m, value: m }))} />
          </Form.Item>

          <Form.Item label="投放链接" name="originUrl" rules={[{ required: true, message: '请输入投放链接' }]}>
            <Input.TextArea rows={3} placeholder="请输入原始投放链接，仅限H5链接" />
          </Form.Item>

          <Form.Item label="投放参数">
            <div className="parameter-panel">
              <div className="parameter-panel-header">
                <Input placeholder="请选择要拼接的参数" prefix={<SearchOutlined />}
                  value={paramSearch} onChange={(e) => setParamSearch(e.target.value)} />
              </div>
              <Collapse ghost defaultActiveKey={PARAM_GROUPS.map((g) => g.group)} items={filteredGroups.map((item) => ({
                key: item.group,
                label: item.group,
                children: (
                  <Checkbox.Group
                    value={selectedParams.filter((v) => item.options.some((o) => o.value === v))}
                    onChange={(groupVals) => {
                      const groupKeys = item.options.map((o) => o.value);
                      setSelectedParams((prev) => {
                        const otherKeys = prev.filter((k) => !groupKeys.includes(k));
                        return [...otherKeys, ...groupVals];
                      });
                      setParamValues((prev) => {
                        const next = { ...prev };
                        groupKeys.forEach((k) => {
                          if (!groupVals.includes(k)) delete next[k];
                        });
                        return next;
                      });
                    }}
                    className="parameter-checkbox-group">
                    {item.options.map((opt) => (
                      <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
                    ))}
                  </Checkbox.Group>
                ),
              }))} />
            </div>
            <div className="parameter-value-list">
              {selectedParams.map((key) => {
                const opt = ALL_OPTIONS.find((o) => o.value === key);
                return (
                  <div key={key} className="parameter-value-row">
                    <div className="parameter-value-label">{opt?.label || key}</div>
                    <Input
                      placeholder={`请输入${opt?.label || key}`}
                      value={paramValues[key] || ''}
                      onChange={(e) => setParamValues((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                    <Button type="text" icon={<CloseOutlined />}
                      onClick={() => {
                        setSelectedParams((prev) => prev.filter((k) => k !== key));
                        setParamValues((prev) => { const next = { ...prev }; delete next[key]; return next; });
                      }} />
                  </div>
                );
              })}
            </div>
          </Form.Item>

          <div className="form-footer">
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
              <Button disabled={loading} onClick={() => navigate(-1)}>取消</Button>
            </Space>
          </div>
        </Form>
      </Card>

      {/* 投放内容设置弹窗 */}
      <Modal title="投放内容设置" open={contentModalOpen}
        onCancel={() => { setContentModalOpen(false); setNewContentName(''); setEditingContent(null); }}
        footer={null} width={560}>
        <div className="setting-modal-toolbar">
          <Button type="primary" onClick={() => setNewContentName(' ')}>新增内容</Button>
        </div>
        <Table rowKey="id" columns={contentColumns} dataSource={contents} pagination={false} size="small" />
        {newContentName !== '' && (
          <div className="setting-inline-editor">
            <Input placeholder="请输入投放内容"
              value={newContentName.trim()}
              onChange={(e) => setNewContentName(e.target.value)} />
            <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />} onClick={handleCreateContent} />
            <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => setNewContentName('')} />
          </div>
        )}
      </Modal>

      {/* 投放平台设置弹窗 */}
      <Modal title="投放平台设置" open={platformModalOpen}
        onCancel={() => { setPlatformModalOpen(false); setNewPlatformName(''); setEditingPlatform(null); }}
        footer={null} width={700}>
        <div className="setting-modal-toolbar">
          <Button type="primary" onClick={() => setNewPlatformName(' ')}>新增平台</Button>
        </div>
        {newPlatformName !== '' && (
          <div className="setting-inline-editor" style={{ marginBottom: 8 }}>
            <Input placeholder="请输入投放平台名称"
              value={newPlatformName.trim()}
              onChange={(e) => setNewPlatformName(e.target.value)} />
            <Button type="text" icon={<CheckOutlined style={{ color: 'green' }} />} onClick={handleCreatePlatform} />
            <Button type="text" icon={<CloseOutlined style={{ color: 'red' }} />} onClick={() => setNewPlatformName('')} />
          </div>
        )}
        <Table rowKey="id" columns={platformColumns} dataSource={platforms} pagination={false} size="small"
          expandable={{ expandedRowRender, defaultExpandAllRows: true }} />
      </Modal>

      {/* 创建成功-复制链接弹窗 */}
      <Modal title="复制链接" open={resultModalOpen} footer={null}
        onCancel={() => { setResultModalOpen(false); navigate('/delivery/link-management'); }}>
        <div style={{ marginBottom: 16, color: '#52c41a', fontWeight: 500 }}>✅ 投放链接已创建成功！</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>渠道地址：</span>
            <Button type="link" size="small" icon={<CopyOutlined />}
              onClick={() => copyText(resultVO?.fullUrl || '')}>复制</Button>
          </div>
          <div style={{ wordBreak: 'break-all', color: '#555', fontSize: 13 }}>{resultVO?.fullUrl}</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>短链地址：</span>
            <Button type="link" size="small" icon={<CopyOutlined />}
              onClick={() => copyText(resultVO?.shortUrl || '')}>复制</Button>
          </div>
          <div style={{ wordBreak: 'break-all', color: '#555', fontSize: 13 }}>{resultVO?.shortUrl}</div>
        </div>
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button onClick={() => { setResultModalOpen(false); navigate('/delivery/link-management'); }}>关闭</Button>
        </div>
      </Modal>
    </>
  );
}

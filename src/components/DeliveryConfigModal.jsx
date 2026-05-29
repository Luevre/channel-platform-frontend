import { CloseOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import {
  AutoComplete, Button, Checkbox, Collapse, Form,
  Input, Modal, Select, message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createDeliveryLink, getContents, getPlatforms } from '../api/deliveryLink';
import { getPlacementParamPage } from '../api/placementParam';

const PROMO_MODES = ['网销线上推广', '网金线下推广', '网销线下推广'];

export default function DeliveryConfigModal({ open, onSubmit, onCancel, initialValues }) {
  const [form] = Form.useForm();
  const [platforms, setPlatforms] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [paramGroups, setParamGroups] = useState([]);
  const [paramSuggestions, setParamSuggestions] = useState({});
  const [selectedParams, setSelectedParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [paramSearch, setParamSearch] = useState('');

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultVO, setResultVO] = useState(null);

  const allOptions = useMemo(() => paramGroups.flatMap((g) => g.options), [paramGroups]);

  const filteredGroups = useMemo(() => {
    if (!paramSearch.trim()) return paramGroups;
    const kw = paramSearch.trim().toLowerCase();
    return paramGroups
      .map((g) => ({
        ...g,
        options: g.options.filter(
          (o) => o.label.toLowerCase().includes(kw) || o.value.toLowerCase().includes(kw)
        ),
      }))
      .filter((g) => g.options.length > 0);
  }, [paramSearch, paramGroups]);

  useEffect(() => {
    if (!open) return;

    getPlatforms().then((res) => setPlatforms(res?.data || [])).catch(() => {});
    getContents().then((res) => setContents(res?.data || [])).catch(() => {});

    getPlacementParamPage({ current: 1, size: 500 })
      .then((res) => {
        const records = res?.data?.records || [];
        const groupMap = {};
        const sugMap = {};
        const seen = new Set();
        records.forEach((item) => {
          const cat = item.category || '其他参数';
          if (!groupMap[cat]) groupMap[cat] = [];
          const key = `${cat}::${item.paramKey}`;
          if (!seen.has(key)) {
            seen.add(key);
            groupMap[cat].push({ label: `${item.paramKey} | ${item.paramName}`, value: item.paramKey });
          }
          if (item.paramValue) {
            if (!sugMap[item.paramKey]) sugMap[item.paramKey] = [];
            item.paramValue.split(/[,，;；\s]+/).filter(Boolean).forEach((v) => {
              if (!sugMap[item.paramKey].includes(v)) sugMap[item.paramKey].push(v);
            });
          }
        });
        setParamSuggestions(sugMap);
        const ORDER = ['场景参数', '活动参数', '产品参数', '人员参数'];
        setParamGroups(
          Object.entries(groupMap)
            .sort(([a], [b]) => {
              const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
              return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
            })
            .map(([group, options]) => ({ group, options }))
        );
      })
      .catch(() => {});

    if (initialValues) {
      form.setFieldsValue({
        linkName:    initialValues.linkName    || undefined,
        channel:     initialValues.channel     || undefined,
        channelCode: initialValues.channelCode || undefined,
        content:     initialValues.content     || undefined,
        promoMode:   initialValues.promoMode   || '网销线上推广',
        originUrl:   initialValues.originUrl   || undefined,
      });
    }
  }, [open, initialValues]); // eslint-disable-line

  const resetAll = () => {
    form.resetFields();
    setSelectedParams([]);
    setParamValues({});
    setParamSearch('');
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const params = {};
    selectedParams.forEach((key) => { params[key] = paramValues[key] || ''; });

    setLoading(true);
    try {
      const res = await createDeliveryLink({
        linkName:    values.linkName?.trim(),
        channel:     values.channel,
        channelCode: values.channelCode?.trim(),
        content:     values.content,
        promoMode:   values.promoMode,
        originUrl:   values.originUrl?.trim(),
        params,
      });
      setResultVO(res?.data);
      setResultModalOpen(true);
    } catch {
      message.error('创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetAll();
    onCancel();
  };

  const handleResultClose = () => {
    setResultModalOpen(false);
    resetAll();
    onSubmit(resultVO);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text || '').then(() => message.success('已复制'));
  };

  return (
    <>
      <Modal
        title="配置投放链接"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="创建投放链接"
        cancelText="取消"
        confirmLoading={loading}
        width={560}
        zIndex={1300}
        destroyOnClose
        style={{ top: 40 }}
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: 6 } }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
          initialValues={{ promoMode: '网销线上推广' }}
        >
          <Form.Item
            label="投放名称"
            name="linkName"
            rules={[{ required: true, message: '请输入投放名称' }]}
          >
            <Input placeholder="如：京东金融搜索入口-AI选好股" maxLength={100} />
          </Form.Item>

          <Form.Item
            label="投放渠道"
            name="channel"
            rules={[{ required: true, message: '请选择投放渠道' }]}
          >
            <Select
              placeholder="请选择投放渠道"
              showSearch
              allowClear
              options={platforms.map((p) => ({ label: p.name, value: p.name }))}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label="渠道编码"
            name="channelCode"
            rules={[{ required: true, message: '请输入渠道编码' }]}
            extra="渠道的英文标识，如 douyin、jingdong、kuaishou、txzxg"
          >
            <Input placeholder="请输入渠道编码，如 jingdong" maxLength={50} />
          </Form.Item>

          <Form.Item
            label="投放内容"
            name="content"
            rules={[{ required: true, message: '请选择投放内容' }]}
          >
            <Select
              placeholder="请选择投放内容"
              showSearch
              allowClear
              options={contents.map((c) => ({ label: c.name, value: c.name }))}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label="推广模式"
            name="promoMode"
            rules={[{ required: true, message: '请选择推广模式' }]}
          >
            <Select
              placeholder="请选择推广模式"
              options={PROMO_MODES.map((m) => ({ label: m, value: m }))}
            />
          </Form.Item>

          <Form.Item
            label="原始投放链接"
            name="originUrl"
            rules={[{ required: true, message: '请输入投放链接' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入原始投放链接（母链URL，仅限H5链接）" />
          </Form.Item>

          <Form.Item label="投放参数">
            <div className="parameter-panel">
              <div className="parameter-panel-header">
                <Input
                  placeholder="请选择要拼接的参数"
                  prefix={<SearchOutlined />}
                  value={paramSearch}
                  onChange={(e) => setParamSearch(e.target.value)}
                />
              </div>
              <Collapse
                ghost
                defaultActiveKey={paramGroups.map((g) => g.group)}
                items={filteredGroups.map((item) => ({
                  key: item.group,
                  label: item.group,
                  children: (
                    <Checkbox.Group
                      value={selectedParams.filter((v) => item.options.some((o) => o.value === v))}
                      onChange={(groupVals) => {
                        const groupKeys = item.options.map((o) => o.value);
                        setSelectedParams((prev) => [
                          ...prev.filter((k) => !groupKeys.includes(k)),
                          ...groupVals,
                        ]);
                        setParamValues((prev) => {
                          const next = { ...prev };
                          groupKeys.forEach((k) => { if (!groupVals.includes(k)) delete next[k]; });
                          return next;
                        });
                      }}
                      className="parameter-checkbox-group"
                    >
                      {item.options.map((opt) => (
                        <Checkbox key={opt.value} value={opt.value}>{opt.label}</Checkbox>
                      ))}
                    </Checkbox.Group>
                  ),
                }))}
              />
            </div>
            <div className="parameter-value-list">
              {selectedParams.map((key) => {
                const opt = allOptions.find((o) => o.value === key);
                const suggestions = (paramSuggestions[key] || []).map((v) => ({ label: v, value: v }));
                return (
                  <div key={key} className="parameter-value-row">
                    <div className="parameter-value-label">{opt?.label || key}</div>
                    <AutoComplete
                      options={suggestions}
                      placeholder={`请输入 ${opt?.label || key}`}
                      value={paramValues[key] || ''}
                      onChange={(val) => setParamValues((prev) => ({ ...prev, [key]: val }))}
                      filterOption={(input, option) =>
                        (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setSelectedParams((prev) => prev.filter((k) => k !== key));
                        setParamValues((prev) => { const n = { ...prev }; delete n[key]; return n; });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建成功 — 复制链接弹窗 */}
      <Modal
        title="复制链接"
        open={resultModalOpen}
        footer={null}
        zIndex={1400}
        onCancel={handleResultClose}
      >
        <div style={{ marginBottom: 16, color: '#52c41a', fontWeight: 500 }}>
          ✅ 投放链接已创建成功！
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>渠道地址：</span>
            <Button type="link" size="small" icon={<CopyOutlined />}
              onClick={() => copyText(resultVO?.fullUrl)}>复制</Button>
          </div>
          <div style={{ wordBreak: 'break-all', color: '#555', fontSize: 13 }}>
            {resultVO?.fullUrl || '—'}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>短链地址：</span>
            <Button type="link" size="small" icon={<CopyOutlined />}
              onClick={() => copyText(resultVO?.shortUrl)}>复制</Button>
          </div>
          <div style={{ wordBreak: 'break-all', color: '#555', fontSize: 13 }}>
            {resultVO?.shortUrl || '—'}
          </div>
        </div>
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button onClick={handleResultClose}>关闭</Button>
        </div>
      </Modal>
    </>
  );
}

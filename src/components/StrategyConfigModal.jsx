import { MinusCircleOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getConvNodePage } from '../api/convNode';

const DELIVERY_CHANNELS = ['抖音', '快手', '小米', '华为', '雪球', '京东金融', '腾讯自选股'];

const STRATEGY_MODELS = [
  { label: '下载回传模型', value: '下载回传模型' },
  { label: '下载留存模型', value: '下载留存模型' },
  { label: '增值产品签约模型', value: '增值产品签约模型' },
  { label: '客户资产信息模型', value: '客户资产信息模型' },
  { label: '自定义模型', value: '自定义模型' },
];

const MODEL_PRESET_NODES = {
  '下载回传模型': ['APP下载', '首次APP启动', '签署隐私协议', '用户注册', '预约开户', '开户成功'],
};

export default function StrategyConfigModal({ open, onSubmit, onCancel, initialValues }) {
  const [form] = Form.useForm();
  const [allNodes, setAllNodes] = useState([]);
  const [nodeRows, setNodeRows] = useState([{ nodeId: undefined, adParam: '' }]);

  useEffect(() => {
    if (open) {
      getConvNodePage({ current: 1, size: 200 })
        .then((res) => setAllNodes(res?.data?.records || []))
        .catch(() => {});

      if (initialValues) {
        form.setFieldsValue({
          strategyName: initialValues.strategyName || undefined,
          channel:      initialValues.channel      || undefined,
          bizNo:        initialValues.bizNo         || undefined,
          strategyRule: initialValues.strategyRule  || '下载回传模型',
          monitorUrl:   initialValues.monitorUrl    || undefined,
          adInfo:       initialValues.adInfo        || undefined,
          strategyParams: initialValues.strategyParams || undefined,
          callbackRatio: initialValues.callbackRatio ?? 100,
        });
        // 预填节点行（nodeIds 是 id 数组时）
        if (Array.isArray(initialValues.nodeIds) && initialValues.nodeIds.length > 0) {
          setNodeRows(initialValues.nodeIds.map((id) => ({ nodeId: id, adParam: '' })));
        }
      }
    }
  }, [open, initialValues]); // eslint-disable-line

  const nodeOptions = allNodes.map((n) => ({
    label: `${n.nodeName}（${n.convType}）`,
    value: n.id,
  }));

  const getNodeDetail = (nodeId) => allNodes.find((n) => n.id === nodeId);

  const handleModelChange = (value) => {
    const presetNames = MODEL_PRESET_NODES[value];
    if (presetNames && allNodes.length > 0) {
      const presetRows = presetNames
        .map((name) => {
          const node = allNodes.find((n) => n.nodeName === name);
          return node ? { nodeId: node.id, adParam: '' } : null;
        })
        .filter(Boolean);
      if (presetRows.length > 0) {
        setNodeRows(presetRows);
        return;
      }
    }
    setNodeRows([{ nodeId: undefined, adParam: '' }]);
  };

  const updateNodeRow = (index, key, value) => {
    setNodeRows((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addRow = () => setNodeRows((prev) => [...prev, { nodeId: undefined, adParam: '' }]);
  const removeRow = (index) => setNodeRows((prev) => prev.filter((_, i) => i !== index));

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = {
      strategyName:   values.strategyName?.trim(),
      channel:        values.channel,
      channelCode:    values.channel?.toLowerCase().replace(/\s.*/, '') || '',
      bizNo:          values.bizNo?.trim(),
      strategyRule:   values.strategyRule,
      callbackRatio:  values.callbackRatio,
      adInfo:         values.adInfo?.trim(),
      strategyParams: values.strategyParams?.trim(),
      monitorUrl:     values.monitorUrl?.trim(),
      nodes: nodeRows
        .filter((r) => r.nodeId != null)
        .map((r) => ({ nodeId: r.nodeId, adParam: r.adParam })),
    };
    form.resetFields();
    setNodeRows([{ nodeId: undefined, adParam: '' }]);
    onSubmit(data);
  };

  const handleCancel = () => {
    form.resetFields();
    setNodeRows([{ nodeId: undefined, adParam: '' }]);
    onCancel();
  };

  return (
    <Modal
      title="配置回传策略"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="提交给投放助手配置"
      cancelText="取消"
      width={600}
      zIndex={1300}
      destroyOnClose
      style={{ top: 40 }}
      styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: 6 } }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        initialValues={{ strategyRule: '下载回传模型', callbackRatio: 100 }}
      >
        <Form.Item
          label="策略名称"
          name="strategyName"
          rules={[{ required: true, message: '请输入策略名称' }]}
        >
          <Input placeholder="请输入策略名称" maxLength={50} />
        </Form.Item>

        <Form.Item
          label="应用渠道"
          name="channel"
          rules={[{ required: true, message: '请选择应用渠道' }]}
          extra="原型中带有齿轮入口，这里先保留视觉入口。"
        >
          <Select
            placeholder="请选择应用渠道"
            options={DELIVERY_CHANNELS.map((item) => ({ label: item, value: item }))}
            suffixIcon={<SettingOutlined />}
          />
        </Form.Item>

        <Form.Item label="业务编号" name="bizNo">
          <Input placeholder="请输入业务编号" maxLength={64} />
        </Form.Item>

        <Form.Item label="策略模型" name="strategyRule">
          <Select onChange={handleModelChange} options={STRATEGY_MODELS} />
        </Form.Item>

        {/* 回传节点 —— 复用页面同款 CSS */}
        <div className="strategy-node-block">
          <div className="strategy-node-label">回传节点</div>
          <div className="strategy-node-list">
            {nodeRows.map((item, index) => {
              const detail = getNodeDetail(item.nodeId);
              return (
                <div className="strategy-node-row" key={index}>
                  <Select
                    value={item.nodeId}
                    options={nodeOptions}
                    placeholder="请选择节点"
                    onChange={(value) => updateNodeRow(index, 'nodeId', value)}
                    style={{ width: 240 }}
                  />
                  <span className="strategy-node-arrow">→</span>
                  <Input
                    value={item.adParam}
                    placeholder="请输入广告商匹配回传节点名称/编号"
                    onChange={(e) => updateNodeRow(index, 'adParam', e.target.value)}
                  />
                  {index === 0 ? (
                    <Button type="text" icon={<PlusCircleOutlined />} onClick={addRow} />
                  ) : (
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => removeRow(index)}
                    />
                  )}
                  {detail && (
                    <div className="strategy-node-tip">
                      <div>节点事件说明：{detail.eventDesc}</div>
                      <div>节点事件判断：{detail.eventJudge}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Form.Item label="监测链接" name="monitorUrl">
          <Input.TextArea rows={2} placeholder="请输入生产环境监测链接" />
        </Form.Item>

        <Form.Item label="广告商" name="adInfo">
          <Input placeholder='请输入广告商中文简称和编号，用 "/" 隔开' />
        </Form.Item>

        <Form.Item label="策略参数" name="strategyParams">
          <Input placeholder="请输入策略参数" />
        </Form.Item>

        <Form.Item label="回传比例" name="callbackRatio">
          <InputNumber min={0} max={100} addonAfter="%" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

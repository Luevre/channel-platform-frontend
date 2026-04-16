import { MinusCircleOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getConvNodePage } from '../../api/convNode';
import { createConvStrategy, getConvStrategyById, updateConvStrategy } from '../../api/convStrategy';

const DELIVERY_CHANNELS = ['抖音', '快手', '小米', '华为', '雪球'];

export function CallbackStrategyFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const strategyId = useMemo(() => searchParams.get('id'), [searchParams]);
  const isEdit = mode === 'edit';

  const [loading, setLoading] = useState(false);
  const [allNodes, setAllNodes] = useState([]);
  const [nodeRows, setNodeRows] = useState([{ nodeId: undefined, adParam: '' }]);

  // 拉取所有回传节点（不分页，size 给大）
  useEffect(() => {
    getConvNodePage({ current: 1, size: 200 }).then((res) => {
      setAllNodes(res?.data?.records || []);
    });
  }, []);

  // 编辑时回显
  useEffect(() => {
    if (!isEdit || !strategyId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getConvStrategyById(strategyId);
        const record = res?.data;
        if (cancelled || !record) return;
        setNodeRows(
          record.nodes?.length
            ? record.nodes.map((n) => ({ nodeId: n.nodeId, adParam: n.adParam || '' }))
            : [{ nodeId: undefined, adParam: '' }],
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, strategyId]);

  const updateNodeRow = (index, key, value) => {
    setNodeRows((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const addRow = () => {
    setNodeRows((prev) => [...prev, { nodeId: undefined, adParam: '' }]);
  };

  const removeRow = (index) => {
    setNodeRows((prev) => prev.filter((_, i) => i !== index));
  };

  const nodeOptions = allNodes.map((node) => ({
    label: `${node.nodeName}（${node.convType}）`,
    value: node.id,
  }));

  const getNodeDetail = (nodeId) => allNodes.find((n) => n.id === nodeId);

  const handleFinish = async (values) => {
    const data = {
      strategyName: values.strategyName?.trim(),
      channel: values.channel,
      channelCode: values.channel?.toLowerCase().replace(/\s.*/, '') || '',
      bizNo: values.bizNo?.trim(),
      strategyRule: values.strategyRule,
      callbackRatio: values.callbackRatio,
      adInfo: values.adInfo?.trim(),
      strategyParams: values.strategyParams?.trim(),
      monitorUrl: values.monitorUrl?.trim(),
      nodes: nodeRows
        .filter((r) => r.nodeId != null)
        .map((r) => ({ nodeId: r.nodeId, adParam: r.adParam })),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateConvStrategy(strategyId, data);
      } else {
        await createConvStrategy(data);
      }
      message.success(`${isEdit ? '编辑' : '新增'}回传策略成功`);
      navigate('/callback/strategy-management');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">{isEdit ? '编辑回传策略' : '新增回传策略'}</div>
      <Form
        layout="vertical"
        className="form-page"
        initialValues={{ strategyRule: '下载回传模型', callbackRatio: 100 }}
        onFinish={handleFinish}
      >
        <Form.Item label="策略名称" name="strategyName" rules={[{ required: true, message: '请输入策略名称' }]}>
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
          <Select
            options={[
              { label: '下载回传模型', value: '下载回传模型' },
              { label: '下载留存模型', value: '下载留存模型' },
            ]}
          />
        </Form.Item>

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
          <Input.TextArea rows={3} placeholder="请输入生产环境监测链接" />
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

        <div className="form-footer">
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
            <Button disabled={loading} onClick={() => navigate(-1)}>
              取消
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}

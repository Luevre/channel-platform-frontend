import { MinusCircleOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callbackNodes, deliveryChannels } from '../../mock/platformData';

export function CallbackStrategyFormPage() {
  const navigate = useNavigate();
  const [nodeRows, setNodeRows] = useState([
    { nodeId: 'node-3', parameter: '' },
    { nodeId: 'node-5', parameter: '' },
    { nodeId: 'node-6', parameter: '' },
  ]);

  const updateNodeRow = (index, key, value) => {
    setNodeRows((previous) =>
      previous.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  };

  const addRow = () => {
    setNodeRows((previous) => [...previous, { nodeId: callbackNodes[0].id, parameter: '' }]);
  };

  const removeRow = (index) => {
    setNodeRows((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">新增回传策略</div>
      <Form
        layout="vertical"
        className="form-page"
        initialValues={{
          model: '下载回传模型',
          ratio: 100,
        }}
        onFinish={() => {
          message.success('回传策略已保存（Mock）');
          navigate('/callback/strategy-management');
        }}
      >
        <Form.Item label="策略名称" name="name" rules={[{ required: true, message: '请输入策略名称' }]}>
          <Input placeholder="请输入中文参数名称" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="应用渠道"
          name="channel"
          rules={[{ required: true, message: '请选择应用渠道' }]}
          extra="原型中带有齿轮入口，这里先保留视觉入口。"
        >
          <Select
            placeholder="请选择应用渠道"
            options={deliveryChannels.map((item) => ({ label: item, value: item }))}
            suffixIcon={<SettingOutlined />}
          />
        </Form.Item>
        <Form.Item label="策略模型" name="model">
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
              const currentNode = callbackNodes.find((node) => node.id === item.nodeId) || callbackNodes[0];
              return (
                <div className="strategy-node-row" key={`${item.nodeId}-${index}`}>
                  <Select
                    value={item.nodeId}
                    options={callbackNodes.map((node) => ({
                      label: `${node.name}（${node.convType}）`,
                      value: node.id,
                    }))}
                    onChange={(value) => updateNodeRow(index, 'nodeId', value)}
                    style={{ width: 240 }}
                  />
                  <span className="strategy-node-arrow">→</span>
                  <Input
                    value={item.parameter}
                    placeholder="请输入广告商匹配回传节点名称/编号"
                    onChange={(event) => updateNodeRow(index, 'parameter', event.target.value)}
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
                  <div className="strategy-node-tip">
                    <div>节点事件说明：{currentNode.description}</div>
                    <div>节点事件判断：{currentNode.judgeRule}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Form.Item label="监测链接" name="monitorUrl">
          <Input.TextArea rows={3} placeholder="请输入生产环境监测链接" />
        </Form.Item>
        <Form.Item label="渠道编码" name="channelCode">
          <Input placeholder="请输入所属渠道编码" />
        </Form.Item>
        <Form.Item label="广告商" name="advertiser">
          <Input placeholder='请输入广告商中文简称和编号，用 "/" 隔开' />
        </Form.Item>
        <Form.Item label="回传比例" name="ratio">
          <InputNumber min={0} max={100} addonAfter="%" />
        </Form.Item>
        <div className="form-footer">
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={() => navigate(-1)}>取消</Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}

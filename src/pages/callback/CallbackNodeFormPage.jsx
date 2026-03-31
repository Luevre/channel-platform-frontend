import { Button, Card, Form, Input, Select, Space, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { callbackNodeCategories, callbackNodes } from '../../mock/platformData';

export function CallbackNodeFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentRecord = useMemo(() => {
    const nodeId = searchParams.get('id');
    return callbackNodes.find((item) => item.id === nodeId) || callbackNodes[0];
  }, [searchParams]);

  const title = mode === 'edit' ? '编辑回传节点' : '新增回传节点';

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">{title}</div>
      <Form
        layout="vertical"
        className="form-page"
        initialValues={
          mode === 'edit'
            ? {
                name: currentRecord.name,
                convType: currentRecord.convType,
                category: currentRecord.category,
                description: currentRecord.description,
                judgeRule: currentRecord.judgeRule,
                app: '客户端',
              }
            : {
                category: callbackNodeCategories[0],
                app: '客户端',
              }
        }
        onFinish={() => {
          message.success(`${title}已保存（Mock）`);
          navigate('/callback/node-management');
        }}
      >
        <Form.Item label="节点名" name="name" rules={[{ required: true, message: '请输入节点名' }]}>
          <Input placeholder="请输入中文参数名称" maxLength={10} />
        </Form.Item>
        <Form.Item label="convType值" name="convType" rules={[{ required: true, message: '请输入convType值' }]}>
          <Input placeholder="请输入英文参数名称，仅支持英文、下划线、数字组成" maxLength={50} />
        </Form.Item>
        <Form.Item label="节点分类" name="category" rules={[{ required: true, message: '请选择节点分类' }]}>
          <Select options={callbackNodeCategories.map((item) => ({ label: item, value: item }))} />
        </Form.Item>
        <Form.Item label="节点事件说明" name="description" rules={[{ required: true, message: '请输入节点事件说明' }]}>
          <Input.TextArea rows={4} maxLength={300} placeholder="请输入节点事件说明" />
        </Form.Item>
        <Form.Item label="节点事件判断" name="judgeRule" rules={[{ required: true, message: '请输入节点事件判断' }]}>
          <Input.TextArea rows={4} maxLength={300} placeholder="请输入节点事件判断说明" />
        </Form.Item>
        <Form.Item label="节点应用" name="app">
          <Input />
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

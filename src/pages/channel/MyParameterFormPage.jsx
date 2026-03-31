import { Button, Card, Form, Input, Radio, Select, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { placementParameters } from '../../mock/platformData';

export function MyParameterFormPage() {
  const navigate = useNavigate();

  const onFinish = () => {
    message.success('新增我的参数已保存并提交（Mock）');
    navigate('/channel/my-params');
  };

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">新增我的参数</div>
      <Form
        layout="vertical"
        className="form-page"
        onFinish={onFinish}
        initialValues={{ applyType: 'new', parameterId: placementParameters[0].id }}
      >
        <Form.Item label="参数新增" name="applyType" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="new">新参数申请</Radio>
            <Radio value="existing">已有参数录入</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="选择参数" name="parameterId" rules={[{ required: true, message: '请选择参数' }]}>
          <Select
            placeholder="请选择参数"
            options={placementParameters.map((item) => ({
              label: `${item.nameEn} | ${item.nameCn}`,
              value: item.id,
            }))}
          />
        </Form.Item>
        <Form.Item label="参数应用场景" name="scene" rules={[{ required: true, message: '请输入参数应用场景' }]}>
          <Input placeholder="请输入参数应用场景" maxLength={30} />
        </Form.Item>
        <Form.Item label="参数使用说明" name="usage" rules={[{ required: true, message: '请输入参数使用说明' }]}>
          <Input.TextArea
            rows={4}
            maxLength={300}
            placeholder="请描述参数应用说明，包含参数来源、参数使用说明和参数应用场景。"
          />
        </Form.Item>
        <Form.Item label="参数值" name="value" rules={[{ required: true, message: '请输入参数值' }]}>
          <Input placeholder="请输入参数值" />
        </Form.Item>
        <div className="form-footer">
          <Space>
            <Button type="primary" htmlType="submit">
              保存并提交
            </Button>
            <Button onClick={() => navigate(-1)}>取消</Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}

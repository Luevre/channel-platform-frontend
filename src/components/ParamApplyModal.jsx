import { Form, Input, Modal, Select } from 'antd';

const CATEGORIES = ['场景参数', '人员参数', '活动参数', '产品参数'];

export default function ParamApplyModal({ open, onSubmit, onCancel }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    form.resetFields();
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="新增参数申请"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="提交给投放助手确认"
      cancelText="取消"
      width={480}
      zIndex={1300}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          label="参数中文名"
          name="paramName"
          rules={[{ required: true, message: '请输入参数中文名' }]}
        >
          <Input placeholder="如：渠道编码" />
        </Form.Item>

        <Form.Item
          label="参数英文 Key"
          name="paramKey"
          rules={[
            { required: true, message: '请输入参数英文 Key' },
            { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '仅支持英文字母、数字、下划线，且以字母开头' },
          ]}
        >
          <Input placeholder="如：channel_code" />
        </Form.Item>

        <Form.Item
          label="参数分类"
          name="category"
          rules={[{ required: true, message: '请选择参数分类' }]}
        >
          <Select
            placeholder="请选择分类"
            options={CATEGORIES.map((c) => ({ label: c, value: c }))}
          />
        </Form.Item>

        <Form.Item
          label="参数说明"
          name="description"
          rules={[{ required: true, message: '请填写参数说明' }]}
        >
          <Input.TextArea rows={3} placeholder="描述该参数的用途和应用场景" />
        </Form.Item>

        <Form.Item
          label="申请人"
          name="applicant"
          rules={[{ required: true, message: '请填写申请人姓名' }]}
        >
          <Input placeholder="请输入您的姓名" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

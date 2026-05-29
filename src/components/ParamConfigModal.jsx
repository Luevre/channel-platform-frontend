import { Form, Input, Modal, Radio, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { createMyParameter, getPlacementParamOptions } from '../api/myParameter';

export default function ParamConfigModal({ open, onSubmit, onCancel, initialValues }) {
  const [form] = Form.useForm();
  const [applyType, setApplyType] = useState('new');
  const [paramOptions, setParamOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getPlacementParamOptions()
        .then((res) => {
          const list = res?.data || [];
          setParamOptions(list.map((p) => ({
            label: `${p.paramName} | ${p.paramKey}`,
            value: `${p.paramName} | ${p.paramKey}`,
          })));
        })
        .catch(() => {});

      // 预填 AI 提取的字段
      if (initialValues) {
        const type = initialValues.applyType || 'new';
        setApplyType(type);
        form.setFieldsValue({
          applyType: type,
          parameterName: initialValues.parameterName || undefined,
          scene: initialValues.scene || undefined,
          usage: initialValues.usage || undefined,
          value: initialValues.value || undefined,
        });
      }
    }
  }, [open, initialValues]); // eslint-disable-line

  const handleOk = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await createMyParameter({
        parameterName: values.parameterName?.trim(),
        scene:         values.scene?.trim(),
        usage:         values.usage,
        value:         values.applyType === 'existing' ? (values.value?.trim() || '') : '',
        applyType:     values.applyType,
      });
      message.success('参数已保存');
      form.resetFields();
      setApplyType('new');
      onSubmit(values);
    } catch {
      // 错误由 request.js 拦截器统一提示
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setApplyType('new');
    onCancel();
  };

  return (
    <Modal
      title="配置投放参数"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="保存"
      confirmLoading={loading}
      cancelText="取消"
      width={480}
      zIndex={1300}
      destroyOnClose
      style={{ top: 40 }}
      styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: 6 } }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        initialValues={{ applyType: 'new' }}
        onValuesChange={(changed) => {
          if (changed.applyType) {
            setApplyType(changed.applyType);
            form.setFieldsValue({ parameterName: undefined, value: undefined });
          }
        }}
      >
        <Form.Item label="参数新增" name="applyType" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="new">新参数申请</Radio>
            <Radio value="existing">已有参数录入</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="选择参数"
          name="parameterName"
          rules={[{ required: true, message: '请选择参数名' }]}
        >
          <Select
            placeholder="请选择参数名称"
            showSearch
            allowClear
            options={paramOptions}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="参数应用场景"
          name="scene"
          rules={[{ required: true, message: '请输入参数应用场景' }]}
        >
          <Input placeholder="请输入参数应用场景" maxLength={128} />
        </Form.Item>

        <Form.Item
          label="参数使用说明"
          name="usage"
          rules={[{ required: true, message: '请输入参数使用说明' }]}
        >
          <Input.TextArea
            rows={3}
            maxLength={300}
            placeholder="请描述参数应用说明，包含参数来源、参数使用说明和参数应用场景。"
          />
        </Form.Item>

        {applyType === 'existing' && (
          <Form.Item
            label="参数值"
            name="value"
            rules={[{ required: true, message: '请输入参数值' }]}
          >
            <Input placeholder="请输入参数值" maxLength={512} />
          </Form.Item>
        )}
        {applyType === 'new' && (
          <Form.Item label="参数值">
            <Input disabled placeholder="新参数申请无需填写参数值，由管理员审批后分配" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

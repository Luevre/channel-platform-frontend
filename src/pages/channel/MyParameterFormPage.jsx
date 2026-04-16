import { Button, Card, Form, Input, Radio, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createMyParameter, getMyParameterById, updateMyParameter } from '../../api/myParameter';

export function MyParameterFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parameterId = searchParams.get('id');
  const isEdit = mode === 'edit';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 编辑模式：从 API 加载数据填入表单
  useEffect(() => {
    if (isEdit && parameterId) {
      setFetching(true);
      getMyParameterById(parameterId)
        .then((res) => {
          const r = res.data;
          form.setFieldsValue({
            applyType: 'existing',
            scene: r.scene,
            value: r.value,
            parameterName: r.parameterName,
            usage: r.usage,
          });
        })
        .catch(() => message.error('加载参数详情失败'))
        .finally(() => setFetching(false));
    }
  }, [isEdit, parameterId, form]);

  const title = isEdit ? '编辑我的参数' : '新增我的参数';

  const onFinish = async (values) => {
    const data = {
      scene: values.scene?.trim(),
      value: values.value?.trim(),
      parameterName: values.parameterName?.trim(),
      usage: values.usage,
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateMyParameter(parameterId, data);
        message.success('编辑成功');
      } else {
        await createMyParameter(data);
        message.success('新增我的参数已保存并提交');
      }
      navigate('/channel/my-params');
    } catch (e) {
      // 错误已在 request.js 拦截器处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">{title}</div>
      <Form
        form={form}
        layout="vertical"
        className="form-page"
        onFinish={onFinish}
        initialValues={{ applyType: 'new' }}
      >
        <Form.Item label="参数新增" name="applyType" rules={[{ required: true }]}>
          <Radio.Group disabled={fetching}>
            <Radio value="new">新参数申请</Radio>
            <Radio value="existing">已有参数录入</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="选择参数"
          name="parameterName"
          rules={[{ required: true, message: '请输入参数名' }]}
        >
          <Input
            placeholder="请输入参数名，如：channel_type | 渠道编码"
            disabled={fetching}
          />
        </Form.Item>

        <Form.Item
          label="参数应用场景"
          name="scene"
          rules={[{ required: true, message: '请输入参数应用场景' }]}
        >
          <Input
            placeholder="请输入参数应用场景"
            maxLength={128}
            disabled={fetching}
          />
        </Form.Item>

        <Form.Item
          label="参数使用说明"
          name="usage"
          rules={[{ required: true, message: '请输入参数使用说明' }]}
        >
          <Input.TextArea
            rows={4}
            maxLength={300}
            placeholder="请描述参数应用说明，包含参数来源、参数使用说明和参数应用场景。"
            disabled={fetching}
          />
        </Form.Item>

        <Form.Item
          label="参数值"
          name="value"
          rules={[{ required: true, message: '请输入参数值' }]}
        >
          <Input
            placeholder="请输入参数值"
            maxLength={512}
            disabled={fetching}
          />
        </Form.Item>

        <div className="form-footer">
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={fetching}>
              保存并提交
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

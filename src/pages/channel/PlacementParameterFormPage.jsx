import { Button, Card, Checkbox, Form, Input, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPlacementParam, getPlacementParamById, updatePlacementParam } from '../../api/placementParam';

const categoryOptions = [
  { label: '场景参数', value: '场景参数' },
  { label: '人员参数', value: '人员参数' },
  { label: '活动参数', value: '活动参数' },
  { label: '产品参数', value: '产品参数' },
];

export function PlacementParameterFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parameterId = searchParams.get('id');
  const isEdit = mode === 'edit';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 编辑模式：从 API 加载当前记录填入表单
  useEffect(() => {
    if (isEdit && parameterId) {
      setFetching(true);
      getPlacementParamById(parameterId)
        .then((res) => {
          const r = res.data;
          form.setFieldsValue({
            paramName: r.paramName,
            paramKey: r.paramKey,
            paramValue: r.paramValue,
            category: r.category ? r.category.split(',') : [],
            paramUsage: r.paramUsage,
            manager: r.manager,
          });
        })
        .catch(() => message.error('加载参数详情失败'))
        .finally(() => setFetching(false));
    }
  }, [isEdit, parameterId, form]);

  const title = isEdit ? '编辑投放参数' : '新增投放参数';

  const onFinish = async (values) => {
    const data = {
      paramName: values.paramName?.trim(),
      paramKey: values.paramKey?.trim(),
      paramValue: values.paramValue?.trim(),
      category: Array.isArray(values.category) ? values.category.join(',') : values.category,
      paramUsage: values.paramUsage,
      manager: values.manager,
      status: 1,
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updatePlacementParam(parameterId, data);
      } else {
        await createPlacementParam(data);
      }
      message.success(`${title}成功`);
      navigate('/channel/placement-params');
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
      >
        <Form.Item
          label="参数名_中文"
          name="paramName"
          rules={[{ required: true, message: '请输入中文参数名称' }]}
        >
          <Input placeholder="请输入中文参数名称" maxLength={50} disabled={fetching} />
        </Form.Item>

        <Form.Item
          label="参数名_英文"
          name="paramKey"
          rules={[{ required: true, message: '请输入英文参数名称' }]}
        >
          <Input
            placeholder="请输入英文参数名称，仅支持英文、下划线、数字"
            maxLength={64}
            disabled={fetching}
          />
        </Form.Item>

        <Form.Item
          label="参数值示例"
          name="paramValue"
          rules={[{ required: true, message: '请输入参数值示例' }]}
        >
          <Input placeholder="请输入参数值示例" maxLength={100} disabled={fetching} />
        </Form.Item>

        <Form.Item
          label="参数分类"
          name="category"
          rules={[{ required: true, message: '请选择参数分类' }]}
        >
          <Checkbox.Group options={categoryOptions} disabled={fetching} />
        </Form.Item>

        <Form.Item
          label="参数应用"
          name="paramUsage"
          rules={[{ required: true, message: '请输入参数应用说明' }]}
        >
          <Input.TextArea
            rows={4}
            maxLength={300}
            placeholder="请描述参数应用说明，包含参数来源、参数使用说明和参数应用场景。"
            disabled={fetching}
          />
        </Form.Item>

        <Form.Item label="参数管理员" name="manager">
          <Input placeholder="请输入参数管理员姓名" disabled={fetching} />
        </Form.Item>

        <div className="form-footer">
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={fetching}>
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

import { Button, Card, Form, Input, Select, Space, message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parameterCategories, placementParameters } from '../../mock/platformData';
import { createPlacementParam, updatePlacementParam } from '../../api/placementParam';

export function PlacementParameterFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parameterId = searchParams.get('id');
  const isEdit = mode === 'edit';
  const [loading, setLoading] = useState(false);

  const currentRecord = useMemo(() => {
    return placementParameters.find((item) => item.id === parameterId) || placementParameters[0];
  }, [parameterId]);

  const initialValues =
    isEdit
      ? {
          nameCn: currentRecord.nameCn,
          nameEn: currentRecord.nameEn,
          sampleValue: currentRecord.sampleValue,
          category: currentRecord.category,
          application: currentRecord.application,
          manager: currentRecord.manager,
          applicantChannel: currentRecord.applicantChannel,
        }
      : {
          category: parameterCategories[0],
          applicantChannel: '开发配置',
        };

  const title = isEdit ? '编辑投放参数' : '新增投放参数';

  const onFinish = async (values) => {
    const data = {
      paramName: values.nameCn?.trim(),
      channelCode: values.nameEn?.trim(),
      sampleValue: values.sampleValue,
      status: values.category,
      application: values.application,
      manager: values.manager,
      applicantChannel: values.applicantChannel,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">{title}</div>
      <Form
        layout="vertical"
        className="form-page"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Form.Item label="参数名_中文" name="nameCn" rules={[{ required: true, message: '请输入中文参数名称' }]}>
          <Input placeholder="请输入中文参数名称" maxLength={10} />
        </Form.Item>
        <Form.Item label="参数名_英文" name="nameEn" rules={[{ required: true, message: '请输入英文参数名称' }]}>
          <Input placeholder="请输入英文参数名称，仅支持英文、下划线、数字组成" maxLength={50} />
        </Form.Item>
        <Form.Item label="参数值示例" name="sampleValue" rules={[{ required: true, message: '请输入参数值示例' }]}>
          <Input placeholder="请输入参数值示例" maxLength={50} />
        </Form.Item>
        <Form.Item label="参数分类" name="category" rules={[{ required: true, message: '请选择参数分类' }]}>
          <Select options={parameterCategories.map((item) => ({ label: item, value: item }))} />
        </Form.Item>
        <Form.Item label="参数应用" name="application" rules={[{ required: true, message: '请输入参数应用' }]}>
          <Input.TextArea
            rows={4}
            maxLength={300}
            placeholder="请描述参数应用说明，包含参数来源、参数使用说明和参数应用场景。"
          />
        </Form.Item>
        <Form.Item label="参数管理员" name="manager">
          <Input placeholder="请关联参数管理员" suffix={<span className="fake-search-icon">⌕</span>} />
        </Form.Item>
        <Form.Item label="参数申请通道" name="applicantChannel">
          <Input disabled />
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

import { Button, Card, Form, Input, Select, Space, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parameterCategories, placementParameters } from '../../mock/platformData';

export function PlacementParameterFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parameterId = searchParams.get('id');

  const currentRecord = useMemo(() => {
    return placementParameters.find((item) => item.id === parameterId) || placementParameters[0];
  }, [parameterId]);

  const initialValues =
    mode === 'edit'
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

  const title = mode === 'edit' ? '编辑投放参数' : '新增投放参数';

  const onFinish = () => {
    message.success(`${title}已保存（Mock）`);
    navigate('/channel/placement-params');
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

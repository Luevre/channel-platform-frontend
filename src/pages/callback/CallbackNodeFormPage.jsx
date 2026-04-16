import { Button, Card, Form, Input, Select, Space, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { callbackNodeCategories } from '../../constants/convNode';
import { createConvNode, getConvNodeById, updateConvNode } from '../../api/convNode';

export function CallbackNodeFormPage({ mode }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const nodeId = useMemo(() => searchParams.get('id'), [searchParams]);
  const isEdit = mode === 'edit';
  const [loading, setLoading] = useState(false);

  const title = isEdit ? '编辑回传节点' : '新增回传节点';

  useEffect(() => {
    if (!isEdit) {
      form.setFieldsValue({
        category: callbackNodeCategories[0],
        app: '客户端',
      });
      return;
    }
    if (!nodeId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getConvNodeById(nodeId);
        const record = res?.data;
        if (cancelled || !record) return;
        form.setFieldsValue({
          name: record.nodeName,
          convType: record.convType != null ? String(record.convType) : '',
          category: record.eventCategory,
          description: record.eventDesc,
          judgeRule: record.eventJudge,
          app: record.app ?? '客户端',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [form, isEdit, nodeId]);

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">{title}</div>
      <Form
        form={form}
        layout="vertical"
        className="form-page"
        onFinish={async (values) => {
          const data = {
            nodeName: values.name?.trim(),
            convType: values.convType ? Number(values.convType) : undefined,
            eventCategory: values.category,
            eventDesc: values.description,
            eventJudge: values.judgeRule,
          };

          setLoading(true);
          try {
            if (isEdit) {
              await updateConvNode(nodeId, data);
            } else {
              await createConvNode(data);
            }
            message.success(`${title}成功`);
            navigate('/callback/node-management');
          } finally {
            setLoading(false);
          }
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

import { Button, Card, Form, Input, Select, Space, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  createMyDeliveryScene, getMyDeliverySceneById, updateMyDeliveryScene,
} from '../../api/myDeliveryScene';
import { getContents, getPlatforms } from '../../api/deliveryLink';

const PROMO_MODES = ['网销线上推广', '网金线下推广', '网销线下推广'];

export function MyDeliverySceneFormPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sceneId = useMemo(() => searchParams.get('id'), [searchParams]);
  const isEdit = mode === 'edit';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    getContents().then((res) => setContents(res?.data || []));
    getPlatforms().then((res) => setPlatforms(res?.data || []));
  }, []);

  useEffect(() => {
    if (!isEdit || !sceneId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getMyDeliverySceneById(sceneId);
        const record = res?.data;
        if (cancelled || !record) return;
        form.setFieldsValue({
          linkName: record.linkName,
          channel: record.channel,
          content: record.content,
          promoMode: record.promoMode,
          originUrl: record.originUrl,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isEdit, sceneId]); // eslint-disable-line

  const handleFinish = async (values) => {
    const data = {
      linkName: values.linkName?.trim(),
      channel: values.channel,
      content: values.content,
      promoMode: values.promoMode,
      originUrl: values.originUrl?.trim(),
    };
    setLoading(true);
    try {
      if (isEdit) {
        await updateMyDeliveryScene(sceneId, data);
        message.success('编辑成功');
      } else {
        await createMyDeliveryScene(data);
        message.success('新增成功，请在列表中提交审核');
      }
      navigate('/delivery/my-scene');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false} className="page-card form-page-card">
      <div className="page-form-title">{isEdit ? '编辑我的投放场景' : '新增我的投放场景'}</div>
      <Form form={form} layout="vertical" className="form-page" onFinish={handleFinish}>
        <Form.Item label="投放名称" name="linkName" rules={[{ required: true, message: '请输入投放名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="投放渠道" name="channel" rules={[{ required: true, message: '请选择投放渠道' }]}>
          <Select
            placeholder="请选择投放渠道"
            options={platforms.map((p) => ({ label: p.name, value: p.name }))}
          />
        </Form.Item>
        <Form.Item label="投放内容" name="content" rules={[{ required: true, message: '请选择投放内容' }]}>
          <Select
            placeholder="请选择投放内容"
            options={contents.map((c) => ({ label: c.name, value: c.name }))}
          />
        </Form.Item>
        <Form.Item label="推广模式" name="promoMode" rules={[{ required: true, message: '请选择推广模式' }]}>
          <Select placeholder="请选择推广模式"
            options={PROMO_MODES.map((m) => ({ label: m, value: m }))} />
        </Form.Item>
        <Form.Item label="投放链接" name="originUrl">
          <Input.TextArea rows={3} placeholder="请输入原始投放链接" />
        </Form.Item>
        <div className="form-footer">
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            <Button disabled={loading} onClick={() => navigate(-1)}>取消</Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}

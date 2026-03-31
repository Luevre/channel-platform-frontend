import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deliveryChannels,
  deliveryContents,
  deliveryModes,
  deliveryPlatforms,
  selectableParameters,
} from '../../mock/platformData';

export function DeliveryLinkFormPage() {
  const navigate = useNavigate();
  const [contentSettingOpen, setContentSettingOpen] = useState(false);
  const [platformSettingOpen, setPlatformSettingOpen] = useState(false);
  const [selectedParameters, setSelectedParameters] = useState([
    'channel_type',
    'entrance_type',
    'tabKey',
    'employee_id',
  ]);

  const groupedParameterMap = useMemo(() => {
    return selectableParameters.reduce((accumulator, item) => {
      accumulator[item.group] = item.options;
      return accumulator;
    }, {});
  }, []);

  const contentColumns = [
    { title: '投放内容', dataIndex: 'name' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space size={8}>
          <Button type="link" className="table-action-button">
            编辑
          </Button>
          <Button type="link" className="table-action-button">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const platformColumns = [
    { title: '投放平台', dataIndex: 'name' },
    {
      title: '平台位置',
      dataIndex: 'positions',
      render: (value) => value.join('、') || '未配置',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: () => (
        <Space size={8}>
          <Button type="link" className="table-action-button">
            新增位置
          </Button>
          <Button type="link" className="table-action-button">
            编辑
          </Button>
          <Button type="link" className="table-action-button">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card bordered={false} className="page-card form-page-card">
        <div className="page-form-title">新增投放链接</div>
        <Form
          layout="vertical"
          className="form-page"
          initialValues={{
            channel: deliveryChannels[0],
            content: deliveryContents[0],
            mode: deliveryModes[0],
          }}
          onFinish={() => {
            message.success('投放链接已提交（Mock）');
            navigate('/delivery/link-management');
          }}
        >
          <Form.Item label="投放名称" name="name" rules={[{ required: true, message: '请输入投放名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="投放渠道" name="channel" rules={[{ required: true, message: '请选择投放渠道' }]}>
            <Select
              placeholder="请选择投放渠道"
              options={deliveryChannels.map((item) => ({ label: item, value: item }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="dropdown-setting-link">
                    <Button type="link" className="table-action-button" onClick={() => setPlatformSettingOpen(true)}>
                      平台设置
                    </Button>
                  </div>
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="投放内容" name="content" rules={[{ required: true, message: '请选择投放内容' }]}>
            <Select
              placeholder="请选择投放内容"
              options={deliveryContents.map((item) => ({ label: item, value: item }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="dropdown-setting-link">
                    <Button type="link" className="table-action-button" onClick={() => setContentSettingOpen(true)}>
                      内容设置
                    </Button>
                  </div>
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="推广模式" name="mode" rules={[{ required: true, message: '请选择推广模式' }]}>
            <Select
              placeholder="请选择推广模式"
              options={deliveryModes.map((item) => ({ label: item, value: item }))}
            />
          </Form.Item>
          <Form.Item label="投放链接" name="link" rules={[{ required: true, message: '请输入投放链接' }]}>
            <Input.TextArea rows={3} placeholder="请输入原生投放链接，仅限H5链接" />
          </Form.Item>
          <Form.Item label="投放参数">
            <div className="parameter-panel">
              <div className="parameter-panel-header">
                <Input placeholder="请选择要拼接的参数" prefix={<SearchOutlined />} />
              </div>
              <Collapse
                ghost
                items={selectableParameters.map((item) => ({
                  key: item.group,
                  label: item.group,
                  children: (
                    <Checkbox.Group
                      value={selectedParameters}
                      onChange={(value) => setSelectedParameters(value)}
                      className="parameter-checkbox-group"
                    >
                      {item.options.map((option) => (
                        <Checkbox key={option.value} value={option.value}>
                          {option.label}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  ),
                }))}
              />
            </div>
            <div className="parameter-value-list">
              {selectedParameters.map((item) => {
                const matchedOption = Object.values(groupedParameterMap)
                  .flat()
                  .find((option) => option.value === item);

                return (
                  <div key={item} className="parameter-value-row">
                    <div className="parameter-value-label">{matchedOption?.label || item}</div>
                    {item === 'employee_id' ? (
                      <Select
                        placeholder="请输入员工姓名并红线处理"
                        options={[
                          { label: '员工红线处理', value: 'employee-redline' },
                          { label: '员工工号', value: 'employee-id' },
                        ]}
                      />
                    ) : item === 'entrance_type' || item === 'tabKey' ? (
                      <Select
                        placeholder={`请输入${matchedOption?.label || item}`}
                        options={[
                          { label: 'AI签约入口', value: 'ai-sign' },
                          { label: '投顾产品编号', value: 'invest-product' },
                        ]}
                      />
                    ) : (
                      <Input placeholder={`请输入${matchedOption?.label || item}`} />
                    )}
                    <Button type="text" icon={<CloseOutlined />} />
                  </div>
                );
              })}
            </div>
          </Form.Item>
          <div className="form-footer">
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => navigate(-1)}>取消</Button>
            </Space>
          </div>
        </Form>
      </Card>

      <Modal
        title="投放内容设置"
        open={contentSettingOpen}
        onCancel={() => setContentSettingOpen(false)}
        footer={null}
        width={560}
      >
        <div className="setting-modal-toolbar">
          <Button type="primary" onClick={() => message.success('新增内容（Mock）')}>
            新增内容
          </Button>
        </div>
        <Table
          rowKey="name"
          columns={contentColumns}
          dataSource={deliveryContents.map((item) => ({ name: item }))}
          pagination={false}
          size="small"
        />
        <div className="setting-inline-editor">
          <Input placeholder="请输入投放内容" />
          <Button type="text" icon={<CheckOutlined />} />
          <Button type="text" icon={<CloseOutlined />} />
        </div>
      </Modal>

      <Modal
        title="投放平台设置"
        open={platformSettingOpen}
        onCancel={() => setPlatformSettingOpen(false)}
        footer={null}
        width={620}
      >
        <div className="setting-modal-toolbar">
          <Button type="primary" onClick={() => message.success('新增平台（Mock）')}>
            新增平台
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={platformColumns}
          dataSource={deliveryPlatforms}
          pagination={false}
          size="small"
        />
        <div className="setting-inline-editor">
          <Input placeholder="请输入投放平台名称" />
          <Button type="text" icon={<CheckOutlined />} />
          <Button type="text" icon={<CloseOutlined />} />
        </div>
      </Modal>
    </>
  );
}

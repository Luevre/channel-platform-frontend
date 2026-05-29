import { SearchOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import { useState } from 'react';

export default function SearchModal({ open, onSearch, onCancel }) {
  const [keyword, setKeyword] = useState('');

  const handleOk = () => {
    const kw = keyword.trim();
    if (!kw) return;
    setKeyword('');
    onSearch(kw);
  };

  const handleCancel = () => {
    setKeyword('');
    onCancel();
  };

  return (
    <Modal
      title="全局搜索"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="搜索"
      cancelText="取消"
      width={420}
      zIndex={1300}
      style={{ top: 40 }}
      okButtonProps={{ icon: <SearchOutlined />, disabled: !keyword.trim() }}
    >
      <div style={{ padding: '16px 0 8px' }}>
        <Input
          autoFocus
          size="large"
          placeholder="输入关键词，如渠道名、参数名、策略名…"
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleOk}
          allowClear
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
          将同时搜索：投放参数、回传策略、投放链接、回传节点
        </div>
      </div>
    </Modal>
  );
}

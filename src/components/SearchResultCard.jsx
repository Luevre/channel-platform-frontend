import { FileSearchOutlined } from '@ant-design/icons';
import { Divider, Empty, Tag } from 'antd';

const SECTIONS = [
  {
    key: 'params',
    label: '投放参数',
    color: 'blue',
    renderItem: (item) => (
      <div style={{ lineHeight: 1.6 }}>
        <span style={{ fontWeight: 500 }}>{item.name}</span>
        {item.key && <span style={{ color: '#888', marginLeft: 6 }}>| {item.key}</span>}
        {item.scene && <div style={{ color: '#555', fontSize: 12 }}>{item.scene}</div>}
        {item.usage && <div style={{ color: '#888', fontSize: 12 }}>{item.usage}</div>}
      </div>
    ),
  },
  {
    key: 'strategies',
    label: '回传策略',
    color: 'purple',
    renderItem: (item) => (
      <div style={{ lineHeight: 1.6 }}>
        <span style={{ fontWeight: 500 }}>{item.name}</span>
        {item.channel && <span style={{ color: '#888', marginLeft: 6 }}>| {item.channel}</span>}
        {item.model && <div style={{ color: '#555', fontSize: 12 }}>模型：{item.model}</div>}
        {item.nodes && <div style={{ color: '#888', fontSize: 12 }}>节点：{item.nodes}</div>}
      </div>
    ),
  },
  {
    key: 'links',
    label: '投放链接',
    color: 'green',
    renderItem: (item) => (
      <div style={{ lineHeight: 1.6 }}>
        <span style={{ fontWeight: 500 }}>{item.name}</span>
        {item.channel && <span style={{ color: '#888', marginLeft: 6 }}>| {item.channel}</span>}
        {item.content && <div style={{ color: '#555', fontSize: 12 }}>内容：{item.content}</div>}
        {item.status && (
          <Tag color={item.status === '生效中' || item.status === 'active' ? 'success' : 'default'}
            style={{ marginTop: 2, fontSize: 11 }}>
            {item.status}
          </Tag>
        )}
      </div>
    ),
  },
  {
    key: 'nodes',
    label: '回传节点',
    color: 'orange',
    renderItem: (item) => (
      <div style={{ lineHeight: 1.6 }}>
        <span style={{ fontWeight: 500 }}>{item.name}</span>
        {item.type && <span style={{ color: '#888', marginLeft: 6 }}>| {item.type}</span>}
        {item.desc && <div style={{ color: '#888', fontSize: 12 }}>{item.desc}</div>}
      </div>
    ),
  },
];

export default function SearchResultCard({ data }) {
  const hasAny = SECTIONS.some((s) => data[s.key]?.length > 0);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: 8,
      padding: '12px 16px',
      marginTop: 6,
      minWidth: 240,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <FileSearchOutlined style={{ color: '#1a56a0' }} />
        <span style={{ fontWeight: 600, color: '#1a56a0', fontSize: 13 }}>
          「{data.keyword}」搜索结果
        </span>
      </div>

      {!hasAny ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到相关内容" style={{ padding: '8px 0' }} />
      ) : (
        SECTIONS.map((section, si) => {
          const items = data[section.key] || [];
          return (
            <div key={section.key}>
              {si > 0 && <Divider style={{ margin: '8px 0' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Tag color={section.color} style={{ margin: 0, fontSize: 11 }}>{section.label}</Tag>
                <span style={{ fontSize: 11, color: '#aaa' }}>
                  {items.length > 0 ? `${items.length} 条` : '暂无匹配'}
                </span>
              </div>
              {items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{
                      background: '#fafafa',
                      borderRadius: 6,
                      padding: '6px 10px',
                      fontSize: 13,
                    }}>
                      {section.renderItem(item)}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#ccc', fontSize: 12, paddingLeft: 4 }}>暂无匹配</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

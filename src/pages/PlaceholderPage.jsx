import { Card, Empty } from 'antd';

export function PlaceholderPage({ title, description }) {
  return (
    <Card bordered={false} className="page-card">
      <div className="placeholder-page">
        <Empty description={title} />
        <p>{description}</p>
      </div>
    </Card>
  );
}

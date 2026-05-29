import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#1a56a0',
            borderRadius: 10,
            borderRadiusLG: 14,
            borderRadiusSM: 6,
            controlHeight: 36,
            fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
          },
          components: {
            Button: { borderRadius: 10 },
            Input: { borderRadius: 10 },
            Select: { borderRadius: 10 },
            DatePicker: { borderRadius: 10 },
            Card: { borderRadiusLG: 16 },
            Table: { borderRadiusLG: 14 },
            Tag: { borderRadius: 6 },
            Modal: { borderRadiusLG: 16 },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

import { useCallback, useEffect, useRef, useState } from 'react';
import { RobotOutlined, CloseOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { agentChat } from '../api/agent';
import '../styles/ai-assistant.css';

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await agentChat({
        messages: next.map((m) => ({ role: m.role, content: m.content })),
        sessionId,
      });
      const data = res.data;
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '抱歉，网络异常，请稍后重试。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) {
    return (
      <button className="ai-float-btn" onClick={() => setOpen(true)} title="投助 AI 助手">
        <RobotOutlined />
      </button>
    );
  }

  return (
    <>
      <button className="ai-float-btn" onClick={() => setOpen(false)} title="收起">
        <CloseOutlined />
      </button>
      <div className="ai-chat-window">
        <div className="ai-chat-header">
          <div className="ai-chat-avatar">
            <RobotOutlined />
          </div>
          <div className="ai-chat-title-group">
            <div className="ai-chat-title">投助</div>
            <div className="ai-chat-subtitle">你的投放助手</div>
          </div>
          <button className="ai-chat-close" onClick={() => setOpen(false)}>
            <CloseOutlined />
          </button>
        </div>

        <div className="ai-chat-body" ref={bodyRef}>
          {messages.length === 0 && (
            <div className="ai-welcome">你好，我是投助，有什么可以帮你的？</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-msg-row ${msg.role}`}>
              <div className="ai-msg-avatar">
                {msg.role === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
              </div>
              <div className="ai-msg-bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="ai-msg-row assistant">
              <div className="ai-msg-avatar">
                <RobotOutlined />
              </div>
              <div className="ai-msg-bubble ai-typing">
                <span className="ai-typing-dot" />
                <span className="ai-typing-dot" />
                <span className="ai-typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="ai-chat-footer">
          <textarea
            ref={inputRef}
            className="ai-chat-input"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="ai-send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
            <SendOutlined />
          </button>
        </div>
      </div>
    </>
  );
}

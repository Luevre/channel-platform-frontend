import { useCallback, useEffect, useRef, useState } from 'react';
import { RobotOutlined, CloseOutlined, SendOutlined, UserOutlined, ExpandAltOutlined, ShrinkOutlined, DownOutlined } from '@ant-design/icons';
import { agentChat } from '../api/agent';
import { searchAll } from '../api/search';
import ParamConfirmCard from './ParamConfirmCard';
import DeliveryUrlCard from './DeliveryUrlCard';
import ConvStrategyCard from './ConvStrategyCard';
import SearchResultCard from './SearchResultCard';
import ParamApplyModal from './ParamApplyModal';
import ParamConfigModal from './ParamConfigModal';
import DeliveryConfigModal from './DeliveryConfigModal';
import StrategyConfigModal from './StrategyConfigModal';
import SearchModal from './SearchModal';
import '../styles/ai-assistant.css';

const WELCOME_CHIPS = [
  { label: '配置投放参数', modal: 'paramConfig' },
  { label: '配置投放链接', modal: 'deliveryConfig' },
  { label: '配置回传策略', modal: 'strategyConfig' },
  { label: '搜索', skill: 'search' },
];

function parseNumberedOptions(text) {
  const lines = text.split('\n');
  const options = [];
  for (const line of lines) {
    const m = line.match(/^(\d+)[.)、]\s*(.+)$/);
    if (m) options.push(m[2].trim());
  }
  return options.length >= 2 ? options.slice(0, 6) : [];
}

const CONFIRM_PATTERNS = [
  '请确认', '是否合适', '确认无误', '是否正确', '确认后我就',
  '确认提交', '以上信息', '你看是否', '信息是否', '是否需要修改',
];

function isConfirmMessage(text) {
  return CONFIRM_PATTERNS.some((p) => text.includes(p));
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    });
  }, []);

  const handleBodyScroll = useCallback(() => {
    if (!bodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 80);
  }, []);

  useEffect(() => {
    scrollToBottom();
    // 新消息滚到底后隐藏按钮
    setShowScrollBtn(false);
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
        skillType: currentSkill || undefined,
      });
      const data = res.data;
      setSessionId(data.sessionId);
      if (data.skillType && data.skillType !== 'general') setCurrentSkill(data.skillType);
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

  const prefillTriggeredRef = useRef(new Set());
  const [confirmedMessages, setConfirmedMessages] = useState(new Set());
  const [paramModalOpen, setParamModalOpen] = useState(false);
  const [paramConfigModalOpen, setParamConfigModalOpen] = useState(false);
  const [deliveryConfigModalOpen, setDeliveryConfigModalOpen] = useState(false);
  const [strategyConfigModalOpen, setStrategyConfigModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState(null);
  const [deliveryPrefillValues, setDeliveryPrefillValues] = useState(null);
  const [strategyPrefillValues, setStrategyPrefillValues] = useState(null);

  const handleSearch = async (kw) => {
    setSearchModalOpen(false);
    const userMsg = { role: 'user', content: `搜索：${kw}` };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await searchAll(kw);
      const cardData = { ...res.data, keyword: kw };
      // 包成 JSON 代码块，复用 parseCardData 渲染逻辑
      const content = '```json\n' + JSON.stringify(cardData) + '\n```';
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '搜索失败，请检查网络后重试。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryConfigSubmit = (resultVO) => {
    setDeliveryConfigModalOpen(false);
    setDeliveryPrefillValues(null);
    const lines = ['✅ 投放链接已创建成功！'];
    if (resultVO?.fullUrl)  lines.push(`渠道地址：${resultVO.fullUrl}`);
    if (resultVO?.shortUrl) lines.push(`短链地址：${resultVO.shortUrl}`);
    setMessages((prev) => [...prev, { role: 'assistant', content: lines.join('\n') }]);
  };

  const handleParamConfigSubmit = (values) => {
    setParamConfigModalOpen(false);
    setPrefillValues(null);
    const typeLabel = values.applyType === 'new' ? '新参数申请' : '已有参数录入';
    const lines = [`✅ 参数已保存（${typeLabel}）`, `参数名：${values.parameterName}`];
    if (values.scene) lines.push(`应用场景：${values.scene}`);
    setMessages((prev) => [...prev, { role: 'assistant', content: lines.join('\n') }]);
  };

  const handleStrategyConfigSubmit = (data) => {
    setStrategyConfigModalOpen(false);
    setStrategyPrefillValues(null);
    const nodeList = data.nodes && data.nodes.length > 0
      ? data.nodes.map((n, i) => `  ${i + 1}. 节点ID ${n.nodeId}${n.adParam ? `，广告商编号：${n.adParam}` : ''}`).join('\n')
      : '  （未选择节点）';
    const parts = [
      `请帮我创建回传策略，信息如下：`,
      `策略名称：${data.strategyName}`,
      `应用渠道：${data.channel}`,
      `策略模型：${data.strategyRule}`,
      `回传节点：\n${nodeList}`,
      `回传比例：${data.callbackRatio}%`,
    ];
    if (data.bizNo) parts.push(`业务编号：${data.bizNo}`);
    if (data.monitorUrl) parts.push(`监测链接：${data.monitorUrl}`);
    if (data.adInfo) parts.push(`广告商：${data.adInfo}`);
    if (data.strategyParams) parts.push(`策略参数：${data.strategyParams}`);
    parts.push(`请直接调用 create_conv_strategy_application 创建，完成后告知编号。`);
    sendMessage(parts.join('\n'), 'strategy_config');
  };

  const handleParamModalSubmit = (values) => {
    setParamModalOpen(false);
    const msg =
      `请帮我提交参数申请，信息如下：\n` +
      `参数中文名：${values.paramName}\n` +
      `参数英文Key：${values.paramKey}\n` +
      `参数分类：${values.category}\n` +
      `参数说明：${values.description}\n` +
      `申请人：${values.applicant}\n` +
      `请直接生成确认卡片。`;
    sendMessage(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function parseCardData(content) {
    try {
      const match = content.match(/```json\n([\s\S]*?)\n```/);
      if (!match) return null;
      const parsed = JSON.parse(match[1]);
      if (['param_confirm_card', 'delivery_url_card', 'conv_strategy_confirm_card',
           'param_prefill_card', 'delivery_prefill_card', 'strategy_prefill_card',
           'search_result_card'].includes(parsed.type)) return parsed;
      return null;
    } catch {
      return null;
    }
  }

  function stripJsonBlock(content) {
    return content.replace(/```json\n[\s\S]*?\n```/, '').trim();
  }

  const markConfirmed = (idx, label) => {
    setConfirmedMessages((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setMessages((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, confirmed: label } : m))
    );
  };

  function extractTextAndCard(content) {
    const cardData = parseCardData(content);
    const text = stripJsonBlock(content);
    return { text, cardData };
  }

  const handleCardConfirm = (idx) => {
    const now = new Date();
    const label = `已于 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 提交确认`;
    markConfirmed(idx, label);
    sendMessage('确认提交');
  };

  const handleCardCancel = (idx) => {
    markConfirmed(idx, '已取消');
    sendMessage('取消申请');
  };

  const sendMessage = (text, skillOverride) => {
    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    const skillToSend = skillOverride || currentSkill || undefined;

    agentChat({
      messages: next.map((m) => ({ role: m.role, content: m.content })),
      sessionId,
      skillType: skillToSend,
    })
      .then((res) => {
        const data = res.data;
        setSessionId(data.sessionId);
        if (data.skillType && data.skillType !== 'general') setCurrentSkill(data.skillType);
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '抱歉，网络异常，请稍后重试。' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const renderMessageContent = (msg, idx, isLast) => {
    if (msg.role !== 'assistant') {
      return <div className="ai-msg-bubble">{msg.content}</div>;
    }

    const { text, cardData } = extractTextAndCard(msg.content);
    const options = !cardData && isLast ? parseNumberedOptions(text) : [];

    if (!cardData) {
      const displayText = text || msg.content;
      const showConfirmBtns = isLast && !loading && isConfirmMessage(displayText) && !msg.confirmed;
      return (
        <div className="ai-msg-bubble-wrap">
          <div className="ai-msg-bubble">{displayText}</div>
          {showConfirmBtns && (
            <div className="ai-option-chips">
              <button
                className="ai-option-chip ai-option-chip--confirm"
                onClick={() => {
                  setMessages((prev) =>
                    prev.map((m, i) => (i === idx ? { ...m, confirmed: '已确认' } : m))
                  );
                  sendMessage('确认');
                }}
              >
                ✓ 确认
              </button>
              <button
                className="ai-option-chip"
                onClick={() => sendMessage('需要修改')}
              >
                修改
              </button>
            </div>
          )}
          {!showConfirmBtns && options.length > 0 && (
            <div className="ai-option-chips">
              {options.map((opt, i) => (
                <button key={i} className="ai-option-chip" onClick={() => sendMessage(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (cardData.type === 'param_prefill_card') {
      // 只在参数申请 skill 下响应
      if (currentSkill !== 'param_apply') {
        return <div className="ai-msg-bubble">{text || msg.content}</div>;
      }
      if (!prefillTriggeredRef.current.has(idx)) {
        prefillTriggeredRef.current.add(idx);
        setTimeout(() => {
          setPrefillValues(cardData);
          setCurrentSkill('param_apply');
          setParamConfigModalOpen(true);
        }, 300);
      }
      return (
        <div className="ai-msg-bubble">
          {text || '已分析完成，正在为您打开配置表单…'}
        </div>
      );
    }

    if (cardData.type === 'strategy_prefill_card') {
      // 只在策略配置 skill 下响应
      if (currentSkill !== 'strategy_config') {
        return <div className="ai-msg-bubble">{text || msg.content}</div>;
      }
      if (!prefillTriggeredRef.current.has(idx)) {
        prefillTriggeredRef.current.add(idx);
        setTimeout(() => {
          setStrategyPrefillValues(cardData);
          setCurrentSkill('strategy_config');
          setStrategyConfigModalOpen(true);
        }, 300);
      }
      return (
        <div className="ai-msg-bubble">
          {text ? <div style={{ marginBottom: 6 }}>{text}</div> : null}
          已提取策略信息，正在为您打开配置表单…
        </div>
      );
    }

    if (cardData.type === 'delivery_prefill_card') {
      // 只在链接配置 skill 下响应
      if (currentSkill !== 'delivery_config') {
        return <div className="ai-msg-bubble">{text || msg.content}</div>;
      }
      if (!prefillTriggeredRef.current.has(idx)) {
        prefillTriggeredRef.current.add(idx);
        setTimeout(() => {
          setDeliveryPrefillValues(cardData);
          setCurrentSkill('delivery_config');
          setDeliveryConfigModalOpen(true);
        }, 300);
      }
      const hint = cardData.motherLinkFound
        ? `已从母链库找到「${cardData.motherLinkName}」，正在为您打开配置表单…`
        : '未在母链库找到匹配链接，请在表单中手动填入原始链接。正在打开配置表单…';
      return (
        <div className="ai-msg-bubble">
          {text ? <div style={{ marginBottom: 6 }}>{text}</div> : null}
          {hint}
        </div>
      );
    }

    if (cardData.type === 'search_result_card') {
      return (
        <div className="ai-msg-bubble">
          {text && <div style={{ marginBottom: 6 }}>{text}</div>}
          <SearchResultCard data={cardData} />
        </div>
      );
    }

    if (cardData.type === 'delivery_url_card') {
      return (
        <div className="ai-msg-bubble">
          {text && <div>{text}</div>}
          <DeliveryUrlCard
            data={cardData}
            confirmed={msg.confirmed || false}
            onRequestParam={() => sendMessage('我需要申请参数')}
          />
        </div>
      );
    }

    if (cardData.type === 'conv_strategy_confirm_card') {
      return (
        <div className="ai-msg-bubble">
          {text && <div>{text}</div>}
          <ConvStrategyCard
            data={cardData}
            confirmed={msg.confirmed || false}
            onConfirm={() => {
              const now = new Date();
              const label = `已于 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 提交确认`;
              markConfirmed(idx, label);
              sendMessage('确认提交');
            }}
            onCancel={() => {
              markConfirmed(idx, '已取消');
              sendMessage('取消申请');
            }}
          />
        </div>
      );
    }

    return (
      <div className="ai-msg-bubble">
        {text && <div>{text}</div>}
        <ParamConfirmCard
          data={cardData}
          confirmed={msg.confirmed || false}
          onConfirm={() => handleCardConfirm(idx)}
          onCancel={() => handleCardCancel(idx)}
        />
      </div>
    );
  };

  if (!open) {
    return (
      <button className="ai-float-btn" onClick={() => setOpen(true)} title="投放助手 AI 助手">
        <RobotOutlined />
      </button>
    );
  }

  return (
    <>
      <ParamApplyModal
        open={paramModalOpen}
        onSubmit={handleParamModalSubmit}
        onCancel={() => setParamModalOpen(false)}
      />
      <ParamConfigModal
        open={paramConfigModalOpen}
        onSubmit={handleParamConfigSubmit}
        onCancel={() => { setParamConfigModalOpen(false); setPrefillValues(null); }}
        initialValues={prefillValues}
      />
      <DeliveryConfigModal
        open={deliveryConfigModalOpen}
        onSubmit={handleDeliveryConfigSubmit}
        onCancel={() => { setDeliveryConfigModalOpen(false); setDeliveryPrefillValues(null); }}
        initialValues={deliveryPrefillValues}
      />
      <StrategyConfigModal
        open={strategyConfigModalOpen}
        onSubmit={handleStrategyConfigSubmit}
        onCancel={() => { setStrategyConfigModalOpen(false); setStrategyPrefillValues(null); }}
        initialValues={strategyPrefillValues}
      />
      <SearchModal
        open={searchModalOpen}
        onSearch={handleSearch}
        onCancel={() => setSearchModalOpen(false)}
      />
      <button className="ai-float-btn" onClick={() => setOpen(false)} title="收起">
        <CloseOutlined />
      </button>
      <div className={`ai-chat-window${expanded ? ' ai-chat-window--expanded' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-avatar">
            <RobotOutlined />
          </div>
          <div className="ai-chat-title-group">
            <div className="ai-chat-title">投放助手</div>
            <div className="ai-chat-subtitle">
              {currentSkill ? (
                <span className="ai-skill-badge">
                  {{
                    param_apply:     '参数申请 Agent',
                    delivery_config: '链接配置 Agent',
                    strategy_config: '策略配置 Agent',
                    search:          '全局搜索 Agent',
                  }[currentSkill]}
                  <button className="ai-skill-exit" onClick={() => { setCurrentSkill(null); setMessages([]); setSessionId(null); }} title="退出当前 Skill">×</button>
                </span>
              ) : '你的投放助手'}
            </div>
          </div>
          <button className="ai-chat-close" onClick={() => setExpanded((v) => !v)} title={expanded ? '收起' : '放大'}>
            {expanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
          </button>
          <button className="ai-chat-close" onClick={() => setOpen(false)} title="关闭">
            <CloseOutlined />
          </button>
        </div>

        <div className="ai-chat-body-wrap">
          <div className="ai-chat-body" ref={bodyRef} onScroll={handleBodyScroll}>
            {messages.length === 0 && (
              <div className="ai-welcome">你好，我是投放助手，有什么可以帮你的？</div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-msg-row ${msg.role}`}>
                <div className="ai-msg-avatar">
                  {msg.role === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
                </div>
                {renderMessageContent(msg, idx, idx === messages.length - 1)}
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
          <button
            className={`ai-scroll-bottom-btn${showScrollBtn ? ' visible' : ''}`}
            onClick={scrollToBottom}
            title="回到最新消息"
          >
            <DownOutlined />
          </button>
        </div>

        <div className="ai-chat-footer">
          <div className="ai-shortcut-chips">
            {WELCOME_CHIPS.map((c) => (
              <button
                key={c.label}
                className="ai-shortcut-chip"
                onClick={() => {
                  if (c.modal === 'paramConfig') { setCurrentSkill('param_apply'); setParamConfigModalOpen(true); }
                  else if (c.modal === 'paramApply') { setCurrentSkill('param_apply'); setParamModalOpen(true); }
                  else if (c.modal === 'deliveryConfig') { setCurrentSkill('delivery_config'); setDeliveryConfigModalOpen(true); }
                  else if (c.modal === 'strategyConfig') { setCurrentSkill('strategy_config'); setStrategyConfigModalOpen(true); }
                  else if (c.skill === 'search') {
                    setCurrentSkill('search');
                    setSearchModalOpen(true);
                  }
                  else { setCurrentSkill('strategy_config'); sendMessage(c.text, 'strategy_config'); }
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="ai-footer-input-row">
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
      </div>
    </>
  );
}

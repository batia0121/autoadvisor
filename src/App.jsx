import { useState, useRef, useEffect } from 'react'
import './App.css'

const SYSTEM = `You are AutoAdvisor, an expert AI assistant specializing in all aspects of car ownership for the North American market. You help users make smarter, money-saving decisions about their vehicles.

Your core expertise:
- Car Insurance: Coverage types (liability, collision, comprehensive, gap, umbrella), how to compare quotes, when to lower/raise coverage, common money-wasting mistakes, how insurers calculate rates, bundling discounts, usage-based insurance
- Financing & Leasing: Loan rates, true buy vs. lease cost analysis, refinancing opportunities, dealer financing tactics to avoid, money factor to APR conversion, residual value negotiation, capitalized cost reduction
- Maintenance & Repairs: OEM service schedules vs. what actually matters, cost benchmarks by repair type, DIY vs. shop decisions, how to avoid upsells, extended warranty math, finding trustworthy mechanics
- Depreciation & Resale: Best time to sell by make/model, trade-in vs. private sale value gap, mileage sweet spots, CarFax value vs. KBB vs. Edmunds, CPO certification value
- Total Cost of Ownership: Full TCO calculations including insurance, fuel, maintenance, financing, depreciation, registration, parking — the number dealers don't want you to see
- Car Buying: New vs. certified pre-owned vs. used, negotiation tactics, invoice price vs. MSRP, end-of-month/year timing, how to use competing offers, out-the-door price focus
- Common Scams & Pitfalls: Extended warranties, paint protection packages, VIN etching, documentation fees, yo-yo financing, dealer add-ons, spot delivery

Style guide:
- Be direct and specific — use dollar amounts, percentages, and time ranges when you know them
- Keep responses scannable: short paragraphs; use bullet points only when listing 3+ distinct items
- Ask one clarifying question at the end when the user's specific car, location, or situation would meaningfully change your answer
- Give real opinions — don't hedge everything into uselessness
- If something varies widely by situation, give a range with context for the extremes
- Format numbers clearly: $1,200/year not 1200 dollars per year`

const STARTERS = [
  { label: 'Insurance audit',   icon: CarIcon,    text: 'Am I likely overpaying for car insurance? What should I check first?' },
  { label: 'Buy vs. lease',     icon: ScaleIcon,  text: 'Should I buy or lease my next car? What are the real financial tradeoffs?' },
  { label: 'Maintenance',       icon: WrenchIcon, text: 'What car maintenance do I actually need vs. what dealers try to upsell?' },
  { label: 'True cost',         icon: DollarIcon, text: 'What\'s the true total cost of owning a car that most people underestimate?' },
  { label: 'Best time to sell', icon: TrendIcon,  text: 'When is the optimal time to sell my car to maximize resale value?' },
  { label: 'Buying tactics',    icon: TagIcon,    text: 'What are the most effective tactics to negotiate a lower price on a car?' },
]

function CarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1"/>
      <path d="M21 17h-2M7 17h10"/>
      <path d="M6 9h12l1 4H5l1-4z"/>
      <circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
    </svg>
  )
}
function ScaleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3M3 18l9 3 9-3"/>
      <path d="M3 6c0 2.2 2 4 4.5 4S12 8.2 12 6M12 6c0 2.2 2 4 4.5 4S21 8.2 21 6"/>
    </svg>
  )
}
function WrenchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}
function DollarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  )
}
function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  )
}
function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  )
}

function MessageBubble({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      {msg.role === 'assistant' && (
        <div className="avatar">A</div>
      )}
      <div className="bubble">{msg.content}</div>
    </div>
  )
}

function EmptyState({ onStarter }) {
  return (
    <div className="empty-state">
      <div className="empty-hero">
        <div className="empty-logo">
          <CarIcon />
        </div>
        <h1>AutoAdvisor</h1>
        <p>Ask anything about your car — insurance, financing,<br />maintenance, or when to buy and sell.</p>
      </div>
      <div className="starters-grid">
        {STARTERS.map((s, i) => {
          const Icon = s.icon
          return (
            <button key={i} className="starter-card" onClick={() => onStarter(s.text)}>
              <span className="starter-icon"><Icon /></span>
              <span className="starter-label">{s.label}</span>
              <span className="starter-text">{s.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text.trim() }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)
    inputRef.current?.focus()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM,
          messages: newMsgs,
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Something went wrong — please try again.'
      setMessages([...newMsgs, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark"><CarIcon /></div>
          <span className="logo-text">AutoAdvisor</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Topics</div>
          {STARTERS.map((s, i) => {
            const Icon = s.icon
            return (
              <button key={i} className="nav-item" onClick={() => send(s.text)}>
                <span className="nav-icon"><Icon /></span>
                {s.label}
              </button>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="powered-by">Powered by Claude</div>
          <div className="disclaimer">Not financial or legal advice</div>
        </div>
      </div>

      <main className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <EmptyState onStarter={(t) => send(t)} />
          ) : (
            <>
              {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
              {loading && (
                <div className="message assistant">
                  <div className="avatar">A</div>
                  <TypingDots />
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder="Ask about insurance, financing, maintenance…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="send-btn"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
          <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </main>
    </div>
  )
}

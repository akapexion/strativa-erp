import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown, Sparkles, RotateCcw } from 'lucide-react';

const BOT_NAME = 'Strativa Assistant';

/* ── Knowledge Base ─────────────────────────────────────────────────────── */
const FAQ = [
  {
    id: 'login',
    triggers: ['log in', 'login', 'sign in', 'signin', 'access portal', 'how to login', 'how do i login', 'cant login', "can't login", 'unable to login', 'credential'],
    answer: '🔑 To log in, click **Sign In** in the navbar. Enter your **Employee ID** (e.g. EMP001) and your **password** provided by your HR administrator.\n\nFirst time? Your HR admin sets the initial credentials.',
    followUps: ['I forgot my password', 'What is my Employee ID?', 'Contact support'],
  },
  {
    id: 'password',
    triggers: ['forgot password', 'reset password', 'lost password', 'password help', 'password reset', "don't know password", 'change password', 'update password', 'new password'],
    answer: '🔒 **Forgot your password?** Contact your HR administrator or email **hr-support@strativa.com** with your Employee ID and full name.\n\n**Want to change it?** Inside the portal, click your **Profile** avatar (top-right) → **Change Password** → enter your current password and set a new one.',
    followUps: ['How do I log in?', 'Contact support'],
  },
  {
    id: 'employee-id',
    triggers: ['employee id', 'emp id', 'what is my id', 'find my id', 'user id', 'staff id'],
    answer: '🪪 Your **Employee ID** is assigned by your HR administrator when your account is created (e.g. **EMP001**, **EMP042**). Check your welcome email or ask your HR admin if you\'re unsure.',
    followUps: ['How do I log in?', 'I forgot my password'],
  },
  {
    id: 'leave',
    triggers: ['leave', 'apply leave', 'leave request', 'time off', 'absence', 'annual leave', 'sick leave', 'vacation', 'request leave', 'leave balance', 'leave status'],
    answer: '🏖️ **Applying for Leave:**\n1. Go to **Leaves** in the portal sidebar\n2. Click **Apply for Leave**\n3. Choose leave type, pick your dates, add a reason\n4. Hit **Submit** — your manager is notified automatically\n\nYou can also track your **leave balance** and **history** on the same page.',
    followUps: ['What leave types are available?', 'Who approves my leave?', 'Check leave status'],
  },
  {
    id: 'leave-types',
    triggers: ['leave type', 'what leave', 'sick leave type', 'annual leave type', 'types of leave', 'casual leave', 'medical leave'],
    answer: '📋 **Leave Types** are configured by your HR admin and may include:\n• Annual / Earned Leave\n• Sick Leave\n• Casual Leave\n• Maternity / Paternity Leave\n• Unpaid Leave\n\nAvailable types are shown when you apply. Contact HR for custom policies.',
    followUps: ['How do I apply for leave?', 'Who approves my leave?'],
  },
  {
    id: 'leave-approval',
    triggers: ['who approves', 'leave approved', 'approve leave', 'manager approval', 'leave pending', 'leave rejected'],
    answer: '✅ Your **direct manager** reviews and approves/rejects leave requests. You\'ll receive a **portal notification** when the status changes.\n\nIf your leave is pending for too long, contact your manager directly.',
    followUps: ['How do I apply for leave?', 'How do notifications work?'],
  },
  {
    id: 'kpi',
    triggers: ['kpi', 'key performance', 'performance indicator', 'kpi submission', 'submit kpi', 'fill kpi'],
    answer: '📊 **Submitting a KPI:**\n1. Go to **KPI Submissions** in the portal sidebar\n2. Fill in your Key Performance Indicators for the period\n3. Click **Submit**\n\nYour manager will review and provide feedback. You can track past submissions on the same page.',
    followUps: ['What is a DFI?', 'How does appraisal work?'],
  },
  {
    id: 'dfi',
    triggers: ['dfi', 'daily focus', 'daily report', 'daily log', 'focus items', 'daily submission'],
    answer: '📝 **DFI** stands for **Daily Focus Items** — a daily log where you record your tasks and focus areas for the day.\n\n**To Submit:**\n1. Go to **DFI Submissions** in the sidebar\n2. Fill in today\'s tasks and priorities\n3. Click **Submit**\n\nRegular DFI submissions help managers track productivity and support appraisals.',
    followUps: ['How does appraisal work?', 'What is a KPI?'],
  },
  {
    id: 'appraisal',
    triggers: ['appraisal', 'review', 'evaluation', 'performance review', 'self assessment', 'appraisal form', 'submit appraisal'],
    answer: '⭐ **Performance Appraisal:**\n1. Go to **Appraisal Submissions** in the portal\n2. Fill in your **self-assessment** for the review period\n3. Click **Submit**\n\nYour manager reviews it, adds feedback, and the final appraisal is shared with you. KPI and DFI submissions feed into this process.',
    followUps: ['What is a KPI?', 'What is a DFI?', 'How do I view past appraisals?'],
  },
  {
    id: 'attendance',
    triggers: ['attendance', 'clock in', 'clock out', 'check in', 'mark attendance', 'punch in', 'punch out', 'attendance record', 'work hours', 'present'],
    answer: '⏰ **Marking Attendance:**\n1. Navigate to **Attendance** in the portal\n2. Click **Clock In** when you start your shift\n3. Click **Clock Out** when you finish\n\nYour hours are recorded automatically. You can view your **attendance history** and **monthly summary** on the same page.',
    followUps: ['How do I view my attendance history?', 'What if I forgot to clock in?'],
  },
  {
    id: 'attendance-history',
    triggers: ['attendance history', 'past attendance', 'monthly attendance', 'view attendance', 'attendance record'],
    answer: '📅 To view your **attendance history**, go to **Attendance** in the portal sidebar. You\'ll see a full log of clock-in/out times, work hours per day, and a monthly summary.\n\nFor discrepancies, contact your HR administrator.',
    followUps: ['How do I mark attendance?', 'Contact HR support'],
  },
  {
    id: 'payslip',
    triggers: ['payslip', 'salary', 'pay', 'wages', 'payment', 'salary slip', 'download payslip', 'view salary', 'my pay'],
    answer: '💰 **Viewing Payslips:**\n1. Go to **Salary Payslip** in the portal sidebar\n2. Select the month you want to view\n3. Click **Download** to save as PDF\n\nPayslips are generated monthly by your HR admin. If a payslip is missing, contact HR.',
    followUps: ['Who do I contact about salary issues?', 'Contact support'],
  },
  {
    id: 'forms',
    triggers: ['forms', 'custom form', 'hr form', 'fill form', 'submit form', 'easy form', 'assigned form', 'form submission'],
    answer: '📋 **Using Easy Forms:**\n1. Go to **Easy Forms** in the portal sidebar\n2. You\'ll see all forms assigned to you by your admin\n3. Click a form, fill it in, and hit **Submit**\n\nYour manager will review submissions. You can track their status in the same section.',
    followUps: ['Who assigns forms to me?', 'How do I check form status?'],
  },
  {
    id: 'profile',
    triggers: ['profile', 'my account', 'account settings', 'update profile', 'edit profile', 'personal info'],
    answer: '👤 Click your **Profile avatar** (top-right corner of the portal header) to:\n• View your personal information\n• **Change your password**\n• See your role and department details\n\nTo update personal details like name or department, contact your HR administrator.',
    followUps: ['How do I change my password?', 'Contact HR support'],
  },
  {
    id: 'notifications',
    triggers: ['notification', 'alert', 'reminder', 'bell icon', 'updates', 'inbox'],
    answer: '🔔 **Notifications** appear in the **bell icon** in the portal header. You\'ll be notified for:\n• Leave approvals / rejections\n• Form assignments\n• Appraisal feedback\n• System announcements\n\nClick a notification to go directly to the related item.',
    followUps: ['How do I apply for leave?', 'How does appraisal work?'],
  },
  {
    id: 'roles',
    triggers: ['role', 'user role', 'admin role', 'manager role', 'employee role', 'access level', 'permission', 'who can'],
    answer: '👥 Strativa supports **3 roles**:\n\n• **Admin** — Full platform access: manage employees, configure leave types, forms, payroll, and all reports\n• **Manager / CEO** — Team management: approve leaves, review KPIs, appraisals, and form submissions\n• **Employee** — Self-service: own attendance, leaves, payslips, KPIs, DFIs, and forms',
    followUps: ['What is Strativa?', 'What modules are available?'],
  },
  {
    id: 'about',
    triggers: ['what is strativa', 'about strativa', 'strativa platform', 'what does strativa do', 'strativa'],
    answer: '🏢 **Strativa** is an enterprise HR management platform built by **Apexion**.\n\nIt unifies:\n• Employee Records & Profiles\n• Attendance & Leave Management\n• Performance Appraisals (KPI / DFI)\n• Custom HR Forms\n• Payroll & Payslips\n• Smart Notifications\n\nDesigned for companies of all sizes, Strativa streamlines HR operations in one secure platform.',
    followUps: ['What modules are available?', 'What roles are there?', 'Contact support'],
  },
  {
    id: 'modules',
    triggers: ['module', 'features', 'what can strativa do', 'capabilities', 'what does it include', 'functionalities'],
    answer: '📦 Strativa includes **6 core modules**:\n\n1. **HR Analytics** — Insights & dashboards\n2. **Employee Management** — Records, onboarding\n3. **Leave Management** — Leave types, requests, approvals\n4. **Payroll & Payslips** — Salary processing & downloads\n5. **Easy Forms** — Custom HR forms\n6. **Appraisal Management** — KPI, DFI, performance reviews',
    followUps: ['What is Strativa?', 'How do I access the portal?', 'Contact support'],
  },
  {
    id: 'contact',
    triggers: ['contact', 'support', 'help', 'email', 'reach out', 'get help', 'talk to someone', 'human support', 'hr support', 'hr admin'],
    answer: '📬 **Get in Touch:**\n• **Email:** hr-support@strativa.com\n• **Response time:** Within 24 business hours\n• **Contact page:** Use the **Contact** link in the website navbar for a detailed message form\n\nFor urgent portal issues, contact your **HR administrator** directly.',
    followUps: ['What is Strativa?', 'How do I log in?'],
  },
  {
    id: 'manager-features',
    triggers: ['manager', 'approve', 'team', 'my team', 'manage employees', 'review request', 'manager portal'],
    answer: '👔 As a **Manager**, you can:\n• **Approve/Reject** leave requests\n• **Review** KPI and appraisal submissions\n• **View** team attendance summaries\n• **Assign and review** custom forms\n\nAll actions are in your portal under the **Manager Dashboard**.',
    followUps: ['How do leave approvals work?', 'What is Strativa?'],
  },
  {
    id: 'admin-features',
    triggers: ['admin', 'administrator', 'admin panel', 'admin features', 'manage system', 'system admin'],
    answer: '🛡️ As an **Admin**, you have full control:\n• **Add/Edit/Remove** employees\n• Configure **leave types**\n• Manage **payroll** and generate payslips\n• Create and assign **custom forms**\n• View **all reports** and analytics\n\nAccess the **Admin Dashboard** after logging in with admin credentials.',
    followUps: ['What roles are available?', 'Contact support'],
  },
];

/* ── Suggested starter prompts ──────────────────────────────────────────── */
const QUICK_REPLIES = [
  'How do I log in?',
  'Apply for leave',
  'View my payslip',
  'Submit a KPI',
  'What is Strativa?',
  'Contact support',
];

/* ── NLP Matching Engine ─────────────────────────────────────────────────── */
function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function scoreMatch(message, faq) {
  const lower = message.toLowerCase();
  // Direct substring match — highest confidence
  for (const trigger of faq.triggers) {
    if (lower.includes(trigger)) return 100;
  }
  // Token overlap scoring
  const msgTokens = new Set(tokenize(message));
  let best = 0;
  for (const trigger of faq.triggers) {
    const trigTokens = tokenize(trigger);
    const overlap = trigTokens.filter((t) => msgTokens.has(t)).length;
    const score = trigTokens.length > 0 ? (overlap / trigTokens.length) * 80 : 0;
    if (score > best) best = score;
  }
  return best;
}

function getBotReply(message) {
  let best = null;
  let bestScore = 0;
  for (const faq of FAQ) {
    const score = scoreMatch(message, faq);
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  if (best && bestScore >= 40) {
    return { answer: best.answer, followUps: best.followUps || [] };
  }
  return {
    answer: "🤔 I'm not sure about that. Here are some things I can help with:\n• **Logging in** to the portal\n• **Leave requests** and approvals\n• **KPI / DFI** submissions\n• **Payslips** and salary\n• **Appraisals** and performance reviews\n• **Contact HR support**\n\nTry rephrasing or select one of the options below!",
    followUps: ['How do I log in?', 'Apply for leave', 'Contact support'],
  };
}

/* ── Rich Text Renderer ─────────────────────────────────────────────────── */
function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

/* ── Typing Indicator ───────────────────────────────────────────────────── */
const TypingDots = () => (
  <div className="flex gap-2 items-center">
    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
      <Bot size={12} className="text-indigo-600" />
    </div>
    <div className="bg-white px-3 py-2 rounded-xl flex items-center gap-1" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          style={{ animation: `chatBounce 1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </div>
  </div>
);

/* ── Message Bubble ─────────────────────────────────────────────────────── */
const MessageBubble = ({ msg, onFollowUp }) => {
  const isBot = msg.from === 'bot';
  return (
    <div className={`flex gap-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: isBot ? '#EEF2FF' : 'linear-gradient(135deg,#1D4ED8,#4338CA)' }}
      >
        {isBot ? <Bot size={12} className="text-indigo-600" /> : <User size={11} className="text-white" />}
      </div>
      <div className="flex flex-col gap-1.5 max-w-[82%]">
        <div
          className="px-3 py-2 rounded-xl text-xs leading-relaxed"
          style={{
            background: isBot ? '#fff' : 'linear-gradient(135deg,#1D4ED8,#4338CA)',
            color: isBot ? '#1e293b' : '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            whiteSpace: 'pre-line',
          }}
        >
          {msg.text.split('\n').map((line, li, arr) => (
            <span key={li}>
              {renderText(line)}
              {li < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
        {/* Follow-up chips */}
        {isBot && msg.followUps && msg.followUps.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {msg.followUps.map((fu) => (
              <button
                key={fu}
                onClick={() => onFollowUp(fu)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                style={{ background: '#f1f5f9', borderColor: '#e2e8f0', color: '#475569' }}
              >
                {fu}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Chat Component ─────────────────────────────────────────────────── */
const LiveChat = () => {
  const initialMsg = {
    from: 'bot',
    text: '👋 Hi! I\'m the **Strativa Assistant**. I can help you with logging in, leaves, appraisals, payslips, KPIs, and more!\n\nWhat can I help you with today?',
    ts: Date.now(),
    followUps: [],
  };

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMsg]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback((text) => {
    const msg = text.trim();
    if (!msg || typing) return;
    setMessages((prev) => [...prev, { from: 'user', text: msg, ts: Date.now() }]);
    setInput('');
    setTyping(true);
    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      setTyping(false);
      const { answer, followUps } = getBotReply(msg);
      setMessages((prev) => [...prev, { from: 'bot', text: answer, ts: Date.now(), followUps }]);
    }, delay);
  }, [typing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([initialMsg]);
    setInput('');
    setTyping(false);
  };

  const showQuickReplies = messages.length <= 1;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Open live chat"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #1D4ED8, #4338CA)',
          boxShadow: open
            ? '0 8px 24px rgba(29,78,216,0.5)'
            : '0 8px 24px rgba(29,78,216,0.35)',
        }}
      >
        {open ? (
          <ChevronDown size={16} className="text-white" />
        ) : (
          <>
            <MessageCircle size={15} className="text-white" />
            {/* Unread indicator dot when closed */}
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
              style={{ display: open ? 'none' : 'block' }}
            />
          </>
        )}
        <span className="text-xs font-bold text-white tracking-wide">
          {open ? 'Close' : 'Live Chat'}
        </span>
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-20 left-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: '340px',
            height: '500px',
            background: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(226,232,240,0.9)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)' }}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">{BOT_NAME}</p>
              <p className="text-[10px] text-blue-200 font-medium">Strativa Portal Support</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-blue-200 font-semibold">Online</span>
              </div>
              {/* Reset conversation */}
              <button
                onClick={handleReset}
                title="Clear conversation"
                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
              >
                <RotateCcw size={11} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ background: '#f8fafc' }}
          >
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} onFollowUp={sendMessage} />
            ))}

            {typing && <TypingDots />}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies (shown only at start) */}
          {showQuickReplies && (
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 shrink-0 bg-white border-t border-slate-100">
              <p className="w-full text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Quick questions</p>
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  style={{ background: '#f1f5f9', borderColor: '#e2e8f0', color: '#475569' }}
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-2.5 border-t border-slate-100 shrink-0 bg-white"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the portal…"
              className="flex-1 text-xs px-3 py-2 rounded-xl outline-none border border-slate-200 focus:border-blue-400 bg-slate-50 text-slate-700 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#1D4ED8,#4338CA)' }}
            >
              <Send size={13} className="text-white" />
            </button>
          </form>

          {/* Powered by label */}
          <div className="flex items-center justify-center gap-1 py-1.5 bg-white border-t border-slate-50">
            <Sparkles size={9} className="text-slate-300" />
            <span className="text-[9px] text-slate-300 font-medium tracking-wide">Powered by Strativa AI</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
};

export default LiveChat;

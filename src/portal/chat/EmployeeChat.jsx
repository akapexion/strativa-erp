import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL, getUploadUrl } from "../../config/api";
import { gooeyToast } from "goey-toast";
import {
  MessageSquare,
  Search,
  Send,
  User,
  Clock,
  Check,
  CheckCheck,
  ArrowLeft,
  Users,
  Smile,
  ShieldAlert,
} from "lucide-react";

const EmployeeChat = () => {
  const [conversations, setConversations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null); // active conversation object
  const [activeRecipient, setActiveRecipient] = useState(null); // recipient user object
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("chats"); // "chats" | "colleagues"
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Screen resize detector for responsive mobile drawer
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch eligible participants (same firm colleagues, strictly no admins)
  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/participants`);
      if (res.data?.success) {
        setParticipants(res.data.participants || []);
      }
    } catch (err) {
      console.error("Fetch participants error:", err);
    }
  };

  // Fetch conversations
  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoadingConv(true);
      const res = await axios.get(`${API_BASE_URL}/chat/conversations`);
      if (res.data?.success) {
        setConversations(res.data.conversations || []);
      }
    } catch (err) {
      console.error("Fetch conversations error:", err);
    } finally {
      if (!silent) setLoadingConv(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (convId, silent = false) => {
    if (!convId) return;
    try {
      if (!silent) setLoadingMessages(true);
      const res = await axios.get(`${API_BASE_URL}/chat/messages/${convId}`);
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
    fetchParticipants();
  }, []);

  // Polling for conversation list updates every 8 seconds
  useEffect(() => {
    const convTimer = setInterval(() => {
      fetchConversations(true);
    }, 8000);
    return () => clearInterval(convTimer);
  }, []);

  // Polling for active conversation messages every 3.5 seconds
  useEffect(() => {
    if (!selectedConv?._id) return;
    const msgTimer = setInterval(() => {
      fetchMessages(selectedConv._id, true);
    }, 3500);
    return () => clearInterval(msgTimer);
  }, [selectedConv]);

  // Handle selecting an existing conversation
  const handleSelectConversation = (conv) => {
    setSelectedConv(conv);
    setActiveRecipient(conv.other_participant);
    setShowMobileChat(true);
    fetchMessages(conv._id);
  };

  // Handle selecting a colleague from Directory
  const handleSelectColleague = (colleague) => {
    const existing = conversations.find(
      (c) =>
        c.other_participant?._id === colleague._id ||
        c.participants?.some((p) => p._id === colleague._id)
    );

    setActiveRecipient(colleague);
    setShowMobileChat(true);

    if (existing) {
      setSelectedConv(existing);
      fetchMessages(existing._id);
    } else {
      setSelectedConv(null);
      setMessages([]);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeRecipient?._id || sending) return;

    const text = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/send`, {
        recipient_id: activeRecipient._id,
        message_text: text,
      });

      if (res.data?.success) {
        setMessages((prev) => [...prev, res.data.message]);
        if (!selectedConv) {
          await fetchConversations(true);
          setSelectedConv({ _id: res.data.conversation_id, other_participant: activeRecipient });
        } else {
          fetchConversations(true);
        }
      }
    } catch (err) {
      gooeyToast.error(err.response?.data?.message || "Failed to send message", {
        fillColor: "#FFF",
        timing: { displayDuration: 3000 },
      });
    } finally {
      setSending(false);
    }
  };

  // Filter lists by search
  const filteredConversations = conversations.filter((c) => {
    const name = c.other_participant?.user_fullname || "";
    const role = c.other_participant?.user_designation || "";
    const code = c.other_participant?.user_code || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredParticipants = participants.filter((p) => {
    const name = p.user_fullname || "";
    const role = p.user_designation || "";
    const code = p.user_code || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Security guard in UI: Admins cannot access
  if (currentUser.user_role === "admin" || currentUser.user_role === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Admin Restricted Module</h2>
        <p className="text-sm text-slate-500 max-w-md mt-2">
          Admins are strictly excluded from employee chat to maintain firm isolation and staff privacy.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex h-[78vh] min-h-[550px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── LEFT SIDEBAR: Conversations & Directory ── */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-slate-50/50 ${
            isMobileView && showMobileChat ? "hidden" : "flex"
          }`}
        >
          {/* Top Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-800">Firm Chat</h1>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Internal Colleagues
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search colleagues..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100/70 border border-transparent rounded-xl focus:bg-white focus:border-indigo-400 focus:outline-none transition-all"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mt-3 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTab("chats")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === "chats"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Recent Chats ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("colleagues")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === "colleagues"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Colleagues ({participants.length})
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100/60">
            {tab === "chats" ? (
              loadingConv ? (
                <div className="p-6 text-center text-xs text-slate-400">Loading chats...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-600">No active conversations</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "Colleagues" tab above to start messaging someone.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const partner = conv.other_participant;
                  const isSelected = selectedConv?._id === conv._id;
                  const hasUnread = conv.unread_count > 0;
                  return (
                    <div
                      key={conv._id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-50/70 border-r-4 border-indigo-600"
                          : hasUnread
                          ? "bg-indigo-50/20 hover:bg-slate-100/70"
                          : "hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={getUploadUrl(partner?.user_image)}
                          alt={partner?.user_fullname || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p
                            className={`text-xs truncate ${
                              hasUnread ? "font-black text-slate-900" : "font-bold text-slate-800"
                            }`}
                          >
                            {partner?.user_fullname || "Unknown"}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatMessageTime(conv.last_message?.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-[11px] truncate max-w-[180px] ${
                              hasUnread
                                ? "font-bold text-indigo-600"
                                : "text-slate-500"
                            }`}
                          >
                            {conv.last_message?.text || "Started conversation"}
                          </p>
                          {hasUnread && (
                            <span className="min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              // Colleagues Directory
              filteredParticipants.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No colleagues found matching "{searchTerm}"
                </div>
              ) : (
                filteredParticipants.map((p) => {
                  const isSelected = activeRecipient?._id === p._id;
                  return (
                    <div
                      key={p._id}
                      onClick={() => handleSelectColleague(p)}
                      className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-50/70 border-r-4 border-indigo-600"
                          : "hover:bg-slate-100/60"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={getUploadUrl(p.user_image)}
                          alt={p.user_fullname}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {p.user_fullname}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            {p.user_code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {p.user_designation || (p.is_manager ? "Manager" : "Employee")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* ── RIGHT MAIN PANEL: Active Conversation Thread ── */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            isMobileView && !showMobileChat ? "hidden" : "flex"
          }`}
        >
          {activeRecipient ? (
            <>
              {/* Chat Thread Header */}
              <div className="h-16 px-4 md:px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  {isMobileView && (
                    <button
                      type="button"
                      onClick={() => setShowMobileChat(false)}
                      className="p-1.5 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <div className="relative">
                    <img
                      src={getUploadUrl(activeRecipient.user_image)}
                      alt={activeRecipient.user_fullname}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      {activeRecipient.user_fullname}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {activeRecipient.user_code}
                      </span>
                    </h2>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {activeRecipient.user_designation || "Colleague"} · Active in firm
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
                      <MessageSquare size={22} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      No messages yet with {activeRecipient.user_fullname}
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Send a message below to start collaborating within your firm.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe =
                      msg.sender_id?._id === currentUser._id ||
                      msg.sender_id === currentUser._id;
                    return (
                      <div
                        key={msg._id || index}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-indigo-600 text-white rounded-br-xs"
                              : "bg-white border border-gray-100 text-slate-800 rounded-bl-xs"
                          }`}
                        >
                          {msg.message_text}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium px-1">
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {isMe && (
                            <span>
                              {msg.is_read ? (
                                <CheckCheck size={12} className="text-indigo-600" />
                              ) : (
                                <Check size={12} className="text-slate-400" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 md:p-4 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeRecipient.user_fullname}...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send size={15} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            // No Conversation Selected Empty State
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Users size={32} />
              </div>
              <h2 className="text-base font-bold text-slate-800">Strativa Firm Messaging</h2>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Choose a conversation from the sidebar or click on "Colleagues" to start a direct 1-on-1 discussion with your team members.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeChat;


import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { queryAssistant } from '../services/aiService';
import { logSystemAction } from '../services/versionService';
import { getAllCaseStudies, RESEARCH_SOURCES } from '../services/intelligenceService';
import { getPremiumIntelligence } from '../services/premiumIntelligenceService';

const AIAssistant: React.FC = () => {
    const { user, profile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
        { role: 'assistant', text: "Protocol Assistant Online. How can I facilitate your rebuild today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        // Log action to version history
        if (user) {
            logSystemAction(user.uid, "AI_QUERY", { query: userMessage }, 'AI');
        }

        try {
            // Context injection: Fetch case studies to inform AI
            const studies = await getAllCaseStudies();
            let context = studies.slice(0, 2).map(s => `${s.title}: ${s.findings.join(', ')}`).join('. ');

            // Check for Premium Intelligence (if operator is eligible)
            if (profile?.role === 'PREMIUM_OPERATOR') {
                const premiumData = await getPremiumIntelligence(['React', 'Firebase', 'LLM']); // Example stack
                if (premiumData.length > 0) {
                    const latest = premiumData[0];
                    context += ` [PREMIUM VALIDATION]: Using ${latest.title} (Success Rate: ${latest.simulationData.successRate}%). Benchmark: ${latest.simulationData.benchmarkResult}. Alternative ${latest.simulationData.comparisonApproach} was less effective.`;
                }
            }

            const aiResponse = await queryAssistant(userMessage, { intelligenceContext: context });

            // If the query is about case studies, customize response
            let finalResponse = aiResponse.response;
            if (userMessage.toLowerCase().includes('case study') || userMessage.toLowerCase().includes('example')) {
                finalResponse = `Referencing Protocol Archive: I've found ${studies.length} relevant case studies. For instance, ${studies[0]?.title} showed that ${studies[0]?.findings[0]}. How shall we apply this to your unit?`;
            }

            // Suggest relevant research subreddits if the query is diagnostic
            if (userMessage.toLowerCase().includes('where') || userMessage.toLowerCase().includes('source') || userMessage.toLowerCase().includes('research')) {
                const suggestionList = RESEARCH_SOURCES.SAAS_AND_STARTUPS.slice(0, 3).join(', ');
                finalResponse += `\n\nProtocol Recommendation: You may also want to scan specialized sources like ${suggestionList} for raw field reports.`;
            }

            setMessages(prev => [...prev, { role: 'assistant', text: finalResponse }]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-24 right-6 z-[150] flex flex-col items-end">
            {/* Chat Window */}
            <div className={`mb-4 w-[350px] md:w-[400px] h-[500px] glass border border-[var(--border-primary)] rounded-[30px] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-6 bg-[var(--accent-blue)]/10 border-b border-[var(--border-primary)]/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[var(--accent-blue)] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <iconify-icon icon="ph:cpu-fill" width="20" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">System Assistant</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Active_Protocol_v4.0</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 transition-opacity" aria-label="Close Assistant">
                        <iconify-icon icon="ph:x-bold" width="20" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] leading-relaxed font-sans ${msg.role === 'user'
                                ? 'bg-[var(--accent-blue)] text-white shadow-lg rounded-br-none'
                                : 'bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-bl-none shadow-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4 rounded-2xl rounded-bl-none">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-[var(--accent-blue)] rounded-full animate-bounce" />
                                    <div className="w-1 h-1 bg-[var(--accent-blue)] rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1 h-1 bg-[var(--accent-blue)] rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Operator Command..."
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl pl-4 pr-12 py-3 text-[11px] focus:outline-none focus:border-[var(--accent-blue)]/50 focus:ring-1 focus:ring-[var(--accent-blue)]/20 transition-all font-sans placeholder:opacity-30"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] flex items-center justify-center hover:bg-[var(--accent-blue)] hover:text-white transition-all disabled:opacity-50"
                            aria-label="Send Command"
                        >
                            <iconify-icon icon="ph:paper-plane-right-fill" width="16" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Float Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative group ${isOpen ? 'bg-white text-black scale-90' : 'bg-brand-accent text-white hover:scale-110'}`}
                aria-label={isOpen ? "Close Assistant" : "Access Intelligence"}
            >
                <div className={`absolute inset-0 rounded-full bg-brand-accent/40 animate-ping opacity-20 ${isOpen ? 'hidden' : ''}`} />
                <iconify-icon icon={isOpen ? "ph:minus-bold" : "ph:cpu-fill"} width="28" />
                {!isOpen && (
                    <div className="absolute right-full mr-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-accent">Summon Assistant</span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default AIAssistant;

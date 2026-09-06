import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Icon } from '../ui';
import { API_ENDPOINTS } from '../../config/endpoints';
import { CHATBOT_SYSTEM_PROMPT } from '../../data/chatbotPrompt';
import ReactMarkdown from 'react-markdown';
import './AboutMeChatBot.css';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
  isThinking?: boolean;
}

export function AboutMeChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Hi 👋 I can tell you about Vaibhav. Ask me anything!" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup typing animation on unmount or modal close
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Clear typing when modal closes
  useEffect(() => {
    if (!isOpen && typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        // Opening modal
        previousFocusRef.current = document.activeElement as HTMLElement;
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        // Closing modal
        previousFocusRef.current?.focus();
      }
      return !prev;
    });
  }, []);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleModal();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleModal]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'bot', text: '', isThinking: true },
    ]);

    try {
      const response = await fetch(`${API_ENDPOINTS.chatbot.OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_ENDPOINTS.chatbot.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: API_ENDPOINTS.chatbot.OPENROUTER_MODEL,
          messages: [
            { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
            { role: 'user', content: userText },
          ],
          max_tokens: 200,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'Oops 🙂 I\'m having a small technical hiccup right now. Please try again in a moment.';

      // Replace thinking indicator with typing animation
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot' && lastMessage.isThinking) {
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            isThinking: false,
            isTyping: true,
            text: '',
          };
        }
        return newMessages;
      });

      // Start typing animation
      typeMessage(reply);
    } catch {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot' && lastMessage.isThinking) {
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            isThinking: false,
            isTyping: true,
            text: '',
          };
        }
        return newMessages;
      });
      typeMessage('Oops 🙂 I\'m having a small technical hiccup right now. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  // Typing animation function
  const typeMessage = useCallback((fullText: string) => {
    let currentIndex = 0;
    const typingSpeed = 50; // ms per character

    const typeNextChar = () => {
      if (currentIndex <= fullText.length) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot' && lastMessage.isTyping) {
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              text: fullText.slice(0, currentIndex),
            };
          }
          return newMessages;
        });
        currentIndex++;
        typingTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        // Typing complete
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot' && lastMessage.isTyping) {
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              text: fullText,
              isTyping: false,
            };
          }
          return newMessages;
        });
      }
    };

    typeNextChar();
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        className="aboutme-chatbot__floating-button"
        onClick={toggleModal}
        aria-label={isOpen ? 'Close about me chat' : 'Open about me chat'}
        aria-expanded={isOpen}
        aria-controls="aboutme-chatbot-modal"
        title="Ask about Vaibhav"
        type="button"
      >
        <span className="aboutme-chatbot__floating-icon" aria-hidden={true}>🙋‍♂️</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="aboutme-chatbot__modal-overlay" onClick={toggleModal}>
          <div
            ref={modalRef}
            className="aboutme-chatbot__modal"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="aboutme-chatbot-title"
            id="aboutme-chatbot-modal"
          >
            <button
              className="aboutme-chatbot__close-button"
              onClick={toggleModal}
              aria-label="Close chat"
              type="button"
            >
              <Icon name="x" size={20} aria-hidden={true} />
            </button>

            <h3 id="aboutme-chatbot-title" className="aboutme-chatbot__title">
              About Vaibhav <span aria-hidden={true}>🤖</span>
            </h3>

            <div className="aboutme-chatbot__chat-box" role="log" aria-label="Chat messages" aria-live="polite">
              {messages.map((msg, idx) => (
                <div key={idx} className={`aboutme-chatbot__message aboutme-chatbot__message--${msg.sender}`}>
                  {msg.sender === 'bot' && msg.isThinking ? (
                    <div className="aboutme-chatbot__thinking">
                      <span className="aboutme-chatbot__thinking-dot"></span>
                      <span className="aboutme-chatbot__thinking-dot"></span>
                      <span className="aboutme-chatbot__thinking-dot"></span>
                    </div>
                  ) : msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="aboutme-chatbot__input-area">
              <input
                ref={inputRef}
                type="text"
                className="aboutme-chatbot__input"
                placeholder="Ask about Vaibhav..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                aria-label="Type your message"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                isLoading={isLoading}
                aria-label="Send message"
                type="button"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
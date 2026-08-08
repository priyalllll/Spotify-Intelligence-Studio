import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is my Spotify account password or billing information stored?",
      answer: "Never. Spotify Intelligence Studio uses Spotify's official OAuth 2.0 PKCE single-click authentication protocol. You authenticate directly on Spotify's secure login servers. We only receive a short-lived, read-only telemetry access token."
    },
    {
      question: "How does the AI Insights feature analyze my music taste?",
      answer: "We aggregate your listening audio features (danceability, valence, tempo, energy) along with track timestamps, genre vectors, and temporal artist history. This aggregated telemetry payload is fed into Google Gemini 2.0 LLMs to generate natural language summaries of your shifting musical taste eras."
    },
    {
      question: "Can I export AI-generated recommendations directly back to Spotify?",
      answer: "Yes! With one click, any smart recommendation list or custom telemetry playlist can be instantly created and synchronized directly back into your official Spotify account library with custom generated cover art."
    },
    {
      question: "Is Spotify Intelligence Studio free and open source?",
      answer: "Yes, Spotify Intelligence Studio is an open-source project created for developers, designers, and music telemetry enthusiasts. You can inspect the complete codebase on GitHub."
    },
    {
      question: "How often is my listening telemetry data updated?",
      answer: "Telemetry syncs automatically every time you log into the platform. You can also trigger an instant manual refresh at any time to pull your latest stream history."
    },
    {
      question: "Does Spotify Intelligence Studio work with free Spotify accounts?",
      answer: "Yes! Both Spotify Free and Spotify Premium accounts support Spotify Web API history and telemetry access."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#121212] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-[#1DB954] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-spotify-muted">
            Everything you need to know about telemetry security, AI analysis, and Spotify API integration.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-[#242424] rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[#1DB954]/50 shadow-[0_4px_20px_rgba(29,185,84,0.15)]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base font-bold text-white font-heading pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#181818] text-spotify-muted transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#1DB954]' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-spotify-muted leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

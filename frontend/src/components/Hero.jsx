import { ArrowRight, Terminal, Copy, Check, LayoutGrid, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const INSTALL_CMD = 'curl -fsSL https://s1.tail.shizuha.com/install.sh | bash'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4 text-gray-400" />
      )}
    </button>
  )
}

export default function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero-light -z-10" />

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        {/* Brand Name with Japanese */}
        <div className="mb-6 animate-fade-in flex items-center justify-center gap-4">
          <span className="text-5xl sm:text-6xl lg:text-7xl font-light text-brand-400 dark:text-brand-300 select-none">
            静葉
          </span>
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
            Shizuha
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          AI agents for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">
            your entire stack.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Autonomous AI agents that work across 15+ integrated services — tasks, docs, email, code, finance, HR.
          One CLI. Full agentic workflows.
        </p>

        {/* Install command */}
        <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="rounded-xl bg-gray-900 dark:bg-black border border-gray-700 dark:border-gray-800 overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-500 ml-2 font-mono">Terminal</span>
              </div>
              <CopyButton text={INSTALL_CMD} />
            </div>
            {/* Command */}
            <div className="px-4 py-4 font-mono text-sm sm:text-base text-left">
              <span className="text-green-400">$</span>{' '}
              <span className="text-gray-300">{INSTALL_CMD}</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {isAuthenticated ? (
            <a
              href="#apps"
              className="btn-primary btn-lg flex items-center gap-2 group"
            >
              <LayoutGrid className="h-5 w-5" />
              Open Apps
            </a>
          ) : (
            <a
              href="/id/register"
              className="btn-primary btn-lg flex items-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          )}
          <a
            href="/docs"
            className="btn-outline btn-lg flex items-center gap-2"
          >
            <BookOpen className="h-5 w-5" />
            Documentation
          </a>
        </div>

        {/* Trust indicator */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          Self-hosted. Open MCP servers. Your data stays on your infrastructure.
        </p>
      </div>
    </section>
  )
}

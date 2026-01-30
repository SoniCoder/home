import { KeyRound, Layers, Zap } from 'lucide-react'
import { cn } from '../utils/cn'

const FEATURES = [
  {
    icon: KeyRound,
    title: 'Single Sign-On',
    description:
      'One account, one password. Log in once and access all Shizuha apps instantly without re-authenticating.',
    color: 'text-brand-600 dark:text-brand-400',
    bgColor: 'bg-brand-100 dark:bg-brand-900/50',
  },
  {
    icon: Layers,
    title: 'Unified Experience',
    description:
      'Consistent design language and navigation across all apps. Switch between tools without losing context.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
  },
  {
    icon: Zap,
    title: 'Cross-App Integration',
    description:
      'Link tasks to documents, embed notes in wikis, and connect your workflow across the entire platform.',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/50',
  },
]

export default function FeatureSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Shizuha?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built from the ground up for teams who want integrated tools without the complexity.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                'p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-6',
                  feature.bgColor
                )}
              >
                <feature.icon className={cn('h-6 w-6', feature.color)} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

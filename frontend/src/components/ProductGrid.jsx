import ProductCard from './ProductCard'

// Product registry - all available Shizuha apps
const SHIZUHA_PRODUCTS = [
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Task & Project Management',
    tagline: 'Track tasks, manage projects, and handle alerts in one place.',
    path: '/pulse/',
    icon: 'HeartPulse',
    bgColor: 'bg-indigo-500',
  },
  {
    id: 'connect',
    name: 'Connect',
    description: 'Social Networking',
    tagline: 'Professional networking with real-time social feeds.',
    path: '/connect/',
    icon: 'Users',
    bgColor: 'bg-blue-500',
  },
  {
    id: 'drive',
    name: 'Drive',
    description: 'Cloud Storage',
    tagline: 'Store, share, and collaborate on files securely.',
    path: '/drive/',
    icon: 'HardDrive',
    bgColor: 'bg-cyan-500',
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Personal Note-Taking',
    tagline: 'Capture thoughts with a powerful rich-text editor.',
    path: '/notes/',
    icon: 'StickyNote',
    bgColor: 'bg-sky-500',
  },
  {
    id: 'wiki',
    name: 'Wiki',
    description: 'Team Documentation',
    tagline: 'Build a collaborative knowledge base for your team.',
    path: '/wiki/',
    icon: 'BookOpen',
    bgColor: 'bg-emerald-500',
  },
  {
    id: 'mail',
    name: 'Mail',
    description: 'Email & Calendar',
    tagline: 'Professional email with full calendar integration.',
    path: '/mail/',
    icon: 'Mail',
    bgColor: 'bg-rose-500',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Asset Management',
    tagline: 'Track and manage your physical and digital assets.',
    path: '/inventory/',
    icon: 'Package',
    bgColor: 'bg-amber-500',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Personal Finance',
    tagline: 'Track expenses, split bills, and manage budgets.',
    path: '/finance/',
    icon: 'Wallet',
    bgColor: 'bg-green-500',
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Accounting',
    tagline: 'Double-entry bookkeeping with GST/TDS compliance.',
    path: '/books/',
    icon: 'Calculator',
    bgColor: 'bg-teal-500',
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Human Resources',
    tagline: 'Manage employees, payroll, and organizational structure.',
    path: '/hr/',
    icon: 'UserCog',
    bgColor: 'bg-orange-500',
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Time Tracking',
    tagline: 'Track work hours, timesheets, and attendance.',
    path: '/time/',
    icon: 'Clock',
    bgColor: 'bg-violet-500',
  },
  {
    id: 'agent',
    name: 'Agent',
    description: 'AI Assistant',
    tagline: 'Your AI-powered employee for automation and insights.',
    path: '/agent/',
    icon: 'Bot',
    bgColor: 'bg-pink-500',
  },
  {
    id: 'scs',
    name: 'Cloud',
    description: 'Cloud Infrastructure',
    tagline: 'Deploy and manage virtual machines and cloud resources.',
    path: '/scs/',
    icon: 'Cloud',
    bgColor: 'bg-purple-500',
  },
]

export default function ProductGrid({ isAuthenticated = false }) {
  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need, unified
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A complete suite of productivity tools that work together seamlessly with a single sign-on.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
          {SHIZUHA_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { SHIZUHA_PRODUCTS }

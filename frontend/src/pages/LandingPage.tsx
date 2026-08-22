import { Link } from 'react-router-dom';
import { Zap, CheckCircle, Clock, Wallet, Users, ArrowRight, Shield, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with check-in/check-out tracking and detailed reports.',
  },
  {
    icon: CheckCircle,
    title: 'Leave Management',
    description: 'Streamlined leave requests, approvals, and balance tracking for your entire team.',
  },
  {
    icon: Wallet,
    title: 'Payroll Processing',
    description: 'Automated salary calculations, deductions, and payslip generation.',
  },
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Centralized employee database with profiles, documents, and organizational structure.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Set Up Your Organization',
    description: 'Create your company account and invite your team members in minutes.',
  },
  {
    step: '02',
    title: 'Manage Your Workforce',
    description: 'Track attendance, process leaves, and handle payroll from a single dashboard.',
  },
  {
    step: '03',
    title: 'Gain Insights',
    description: 'Access detailed analytics and reports to make informed HR decisions.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">Dayflow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              How It Works
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Shield size={14} />
              Trusted by 500+ organizations
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Human Resource Management,{' '}
              <span className="text-brand-600">Simplified.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Dayflow brings employee management, attendance tracking, leave workflows,
              and payroll processing into one seamless platform. Built for modern teams
              that value efficiency and clarity.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                Sign In to Your Account
              </Link>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/50">
              <div className="rounded-xl bg-gray-50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-4 h-6 flex-1 rounded-md bg-gray-200" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-3">
                    <div className="h-8 rounded-lg bg-brand-100" />
                    <div className="h-6 rounded-md bg-gray-200" />
                    <div className="h-6 rounded-md bg-gray-200" />
                    <div className="h-6 rounded-md bg-gray-200" />
                    <div className="h-6 rounded-md bg-gray-200" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded-lg bg-white p-3 shadow-sm">
                        <div className="h-3 w-16 rounded bg-gray-200" />
                        <div className="mt-2 h-5 w-10 rounded bg-brand-100" />
                      </div>
                      <div className="h-20 rounded-lg bg-white p-3 shadow-sm">
                        <div className="h-3 w-16 rounded bg-gray-200" />
                        <div className="mt-2 h-5 w-10 rounded bg-green-100" />
                      </div>
                      <div className="h-20 rounded-lg bg-white p-3 shadow-sm">
                        <div className="h-3 w-16 rounded bg-gray-200" />
                        <div className="mt-2 h-5 w-10 rounded bg-purple-100" />
                      </div>
                    </div>
                    <div className="h-40 rounded-lg bg-white p-4 shadow-sm">
                      <div className="h-3 w-24 rounded bg-gray-200" />
                      <div className="mt-3 flex items-end gap-2 h-24">
                        <div className="w-8 rounded-t bg-brand-200" style={{ height: '60%' }} />
                        <div className="w-8 rounded-t bg-brand-300" style={{ height: '80%' }} />
                        <div className="w-8 rounded-t bg-brand-200" style={{ height: '45%' }} />
                        <div className="w-8 rounded-t bg-brand-400" style={{ height: '90%' }} />
                        <div className="w-8 rounded-t bg-brand-200" style={{ height: '70%' }} />
                        <div className="w-8 rounded-t bg-brand-300" style={{ height: '55%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your workforce
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A complete HRMS solution designed to simplify every aspect of human resource management.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in three simple steps.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Stats */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for Modern Teams
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Dayflow is designed to help organizations of all sizes streamline their HR operations
              and focus on what matters most — their people.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '500+', label: 'Organizations' },
              { value: '50K+', label: 'Employees' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your HR operations?
            </h2>
            <p className="mt-4 text-lg text-brand-100">
              Join hundreds of organizations already using Dayflow to manage their workforce.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">Dayflow</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-500 hover:text-gray-700">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-700">How It Works</a>
              <a href="#about" className="text-sm text-gray-500 hover:text-gray-700">About</a>
            </div>
            <div className="flex items-center gap-4">
              <BarChart3 size={16} className="text-gray-400" />
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Dayflow. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

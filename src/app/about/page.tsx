import { Metadata } from 'next';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { User, Target, Award, Heart, Sparkles, Zap, Shield, Globe, Code, Palette, Rocket } from 'lucide-react';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Site Claude';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A production-ready, A platform for ideas, stories, and wisdom—blending modern blogging with timeless knowledge. built with Next.js 14+ and MongoDB, designed to achieve maximum organic search traffic.';

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}: our mission, editorial standards, and the team behind our expert articles, practical tutorials, and research-driven insights.`,
  keywords: 'about us, our story, blog team, content creators, writers, ' + SITE_NAME,
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description: `Get to know ${SITE_NAME}: mission, values, and the people crafting trustworthy, actionable content.`,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `About | ${SITE_NAME}`,
    description: `About ${SITE_NAME}: our mission, standards, and team.`,
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-24 overflow-hidden">
          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent-400/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          
          <div className="container-custom relative">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">About Our Story</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                Welcome to Our
                <span className="block text-accent-300">Digital Story</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                We're a passionate team of writers, developers, and content creators dedicated to 
                sharing knowledge, insights, and stories that matter in today's digital world.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Our Mission</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Our Editorial
                  <span className="block text-primary-600">Mission</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  We believe in the power of well-researched, thoughtful content that educates, 
                  inspires, and connects with our readers. Every article we publish is crafted 
                  with care, backed by expertise, and designed to provide real value.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Content</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every article is thoroughly researched, fact-checked, and written by experts 
                    in their respective fields.
                  </p>
                </div>

                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Reader-First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We prioritize our readers' needs, creating content that's accessible, 
                    engaging, and genuinely helpful.
                  </p>
                </div>

                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Insights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our team brings years of industry experience and deep domain knowledge 
                    to every piece we publish.
                  </p>
                </div>

                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fresh Perspectives</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We stay ahead of trends and bring you the latest insights, innovations, 
                    and thought leadership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-700 rounded-full px-4 py-2 mb-6">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Platform Features</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  What You Can
                  <span className="block text-accent-600">Expect</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  From in-depth tutorials to industry insights, we cover topics that matter 
                  to professionals, entrepreneurs, and lifelong learners.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Technology & Development</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Web development tutorials and guides
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Programming best practices
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Framework deep-dives and comparisons
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Performance optimization techniques
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Industry trends and insights
                    </li>
                  </ul>
                </div>

                <div className="group p-8 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Business & Career</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Entrepreneurship and startup advice
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Career development strategies
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Leadership and team management
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Productivity and workflow optimization
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Digital marketing and growth
                    </li>
                  </ul>
                </div>

                <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Design & UX</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      User experience design principles
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Visual design and branding
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Accessibility and inclusive design
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Design tools and workflows
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      Mobile and responsive design
                    </li>
                  </ul>
                </div>

                <div className="group p-8 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Innovation & Future</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Emerging technologies and AI
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Digital transformation strategies
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Future of work and remote collaboration
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Sustainability in tech
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                      Thought leadership and trends
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
                  <Code className="w-4 h-4" />
                  <span className="text-sm font-medium">Technology Stack</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Our Editorial
                  <span className="block text-primary-600">Standards</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  We maintain the highest standards of journalistic integrity, ensuring every 
                  piece of content is accurate, well-researched, and valuable to our readers.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-2">Fact-Checked</div>
                  <p className="text-sm text-gray-600">Every claim verified</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-2">Expert Authors</div>
                  <p className="text-sm text-gray-600">Industry professionals</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                </div>
                  <div className="text-xl font-bold text-gray-900 mb-2">Reader-Focused</div>
                  <p className="text-sm text-gray-600">Value-driven content</p>
                </div>
                
                <div className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                  <div className="text-xl font-bold text-gray-900 mb-2">Fresh Content</div>
                  <p className="text-sm text-gray-600">Regular updates</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

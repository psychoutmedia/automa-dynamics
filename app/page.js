'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: '🤖',
      title: 'Autonomous Agents',
      description: 'Advanced AI systems capable of independent decision-making and task execution.'
    },
    {
      icon: '🧠',
      title: 'Neural Architectures',
      description: 'Next-generation neural networks designed for complex reasoning and adaptation.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Processing',
      description: 'Low-latency inference for time-critical applications and edge deployment.'
    },
    {
      icon: '🔗',
      title: 'Multi-Agent Coordination',
      description: 'Scalable coordination frameworks for distributed autonomous systems.'
    }
  ]

  const stats = [
    { value: '10⁶', label: 'Parameters' },
    { value: '<10ms', label: 'Latency' },
    { value: '99.9%', label: 'Uptime' },
    { value: '∞', label: 'Possibility' }
  ]

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-wayland-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Automa Dynamics" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="font-semibold text-lg tracking-wide">AUTOMA DYNAMICS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-chrome/70">
            <a href="#mission" className="hover:text-chrome-light transition-colors">Mission</a>
            <a href="#technology" className="hover:text-chrome-light transition-colors">Technology</a>
            <a href="#contact" className="hover:text-chrome-light transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-20" />
        
        {/* Animated Gradient Orb */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-pulse-slow"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Logo */}
          <div className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Image 
              src="/logo.png" 
              alt="Automa Dynamics" 
              width={200} 
              height={200}
              className="mx-auto object-contain mb-6"
              priority
            />
          </div>

          {/* Tagline */}
          <div className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-chrome/60 text-sm tracking-[0.3em] uppercase mb-4">Pioneering Autonomous Intelligence</p>
          </div>

          {/* Main Headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className="text-gradient">Building the Future</span>
            <br />
            <span className="text-chrome-light">of Autonomous Systems</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg md:text-xl text-chrome/70 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            We engineer intelligent agents that think, learn, and act autonomously. 
            From neural architectures to multi-agent coordination, we're defining the next frontier.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <a href="#contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#technology" className="btn-secondary">
              Explore Technology
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-chrome/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-chrome/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2 font-mono">
                  {stat.value}
                </div>
                <div className="text-sm text-chrome/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-chrome/50 text-sm tracking-[0.2em] uppercase mb-4">Our Mission</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Engineering <span className="text-gradient">Autonomous Intelligence</span>
              </h2>
              <p className="text-chrome/70 text-lg leading-relaxed mb-6">
                At Automa Dynamics, we believe the future belongs to systems that can operate with 
                genuine autonomy. Not just following scripts, but understanding, adapting, and 
                evolving. Our mission is to build AI agents that redefine what's possible.
              </p>
              <p className="text-chrome/70 text-lg leading-relaxed">
                From enterprise automation to cutting-edge research, we're deploying intelligent 
                systems across industries, always pushing the boundaries of what's autonomous.
              </p>
            </div>
            <div className="relative">
              <div className="card-glass p-8">
                <div className="font-mono text-sm text-chrome/50 mb-4">// Core Principles</div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400">01.</span>
                    <span className="text-chrome-light">Autonomy First</span>
                  </div>
                  <div className="pl-8 text-chrome/60">
                    Systems that act independently with reasoning
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400">02.</span>
                    <span className="text-chrome-light">Adaptive Learning</span>
                  </div>
                  <div className="pl-8 text-chrome/60">
                    Continuous improvement through experience
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400">03.</span>
                    <span className="text-chrome-light">Safe Deployment</span>
                  </div>
                  <div className="pl-8 text-chrome/60">
                    Robust safeguards for real-world operation
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400">04.</span>
                    <span className="text-chrome-light">Scalable Intelligence</span>
                  </div>
                  <div className="pl-8 text-chrome/60">
                    From edge devices to cloud-scale deployment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="section-padding bg-wayland-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-chrome/50 text-sm tracking-[0.2em] uppercase mb-4">Technology</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-chrome/70 text-lg max-w-2xl mx-auto">
              Full-stack autonomous systems engineering, from neural architectures to deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={feature.title}
                className={`card-glass p-6 hover:bg-wayland-800/50 transition-all duration-300 group ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-chrome-light mb-2">{feature.title}</h3>
                <p className="text-chrome/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-chrome/50 text-sm tracking-[0.2em] uppercase mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Build <span className="text-gradient">Together</span>
          </h2>
          <p className="text-chrome/70 text-lg mb-12">
            Whether you're looking to deploy autonomous agents or push the boundaries of AI research, 
            we want to hear from you.
          </p>

          <div className="card-glass p-8 max-w-md mx-auto">
            <div className="space-y-4">
              <a 
                href="mailto:hello@automadynamics.com"
                className="flex items-center justify-center gap-3 p-4 bg-wayland-800/50 rounded-lg hover:bg-wayland-800 transition-colors"
              >
                <svg className="w-5 h-5 text-chrome/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-chrome-light">hello@automadynamics.com</span>
              </a>
              <a 
                href="https://x.com/automadynamics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-wayland-800/50 rounded-lg hover:bg-wayland-800 transition-colors"
              >
                <svg className="w-5 h-5 text-chrome/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-chrome-light">@automadynamics</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Automa Dynamics" 
              width={24} 
              height={24}
              className="object-contain"
            />
            <span className="text-sm text-chrome/50">© 2026 Automa Dynamics</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-chrome/40">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

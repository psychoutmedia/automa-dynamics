import Image from 'next/image'
import Link from 'next/link'

export default function SiteFooter() {
  return (
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
          <span className="text-sm text-chrome/65">&copy; 2026 Automa Dynamics</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-chrome/65">
          <Link href="/about" className="hover:text-chrome/70 transition-colors">About</Link>
          <Link href="/articles" className="hover:text-chrome/70 transition-colors">Articles</Link>
          <a
            href="https://x.com/automadynamics"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-chrome/70 transition-colors"
          >
            @automadynamics
          </a>
          <a href="/feed.xml" className="hover:text-chrome/70 transition-colors">RSS</a>
          {/* Sits beside RSS deliberately: both are machine-readable endpoints,
              and both need a plain <a> because neither is an app-router page. */}
          <a
            href="/llms.txt"
            title="Machine-readable summary of this site, for AI agents"
            className="font-mono hover:text-chrome/70 transition-colors"
          >
            llms.txt
          </a>
        </div>
      </div>
    </footer>
  )
}

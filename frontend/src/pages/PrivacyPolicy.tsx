import { useEffect } from 'react'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { LandingFooter } from '../components/landing/LandingFooter'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — ConceptIQ'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-main">
      <LandingNavbar />
      
      <main className="pt-32 pb-24 px-5 md:px-8 max-w-3xl mx-auto min-h-[70vh]">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-10 pb-6 border-b border-border/40">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        
        <div className="prose prose-invert prose-p:text-text-muted prose-h2:text-text-main prose-a:text-primary max-w-none space-y-6">
          <p className="leading-relaxed">
            At ConceptIQ, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our application.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect information that you provide directly to us when you register for an account, interact with the AI tutor, or complete learning modules. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-text-muted">
            <li>Personal identifiers (name, email address)</li>
            <li>Learning data (quiz performance, concept mastery, time spent)</li>
            <li>Device and usage information collected automatically via cookies</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-4">2. How We Use Your Information</h2>
          <p className="leading-relaxed">
            We use the information we collect primarily to provide, maintain, and improve our educational services. Specifically, we use your learning data to power the AI tutor and adapt the curriculum to your personal learning pace. We do not sell your personal data to third parties.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">3. Data Security</h2>
          <p className="leading-relaxed">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">4. Your Data Rights</h2>
          <p className="leading-relaxed">
            Depending on your location, you may have rights to access, correct, or delete the personal information we hold about you. You can manage most of your data directly from your account settings. For specific requests, please contact our support team.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@conceptiq.com" className="hover:underline">privacy@conceptiq.com</a>.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

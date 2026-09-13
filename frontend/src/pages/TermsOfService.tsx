import { useEffect } from 'react'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { LandingFooter } from '../components/landing/LandingFooter'

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service — ConceptIQ'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-main">
      <LandingNavbar />
      
      <main className="pt-32 pb-24 px-5 md:px-8 max-w-3xl mx-auto min-h-[70vh]">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main mb-2">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-10 pb-6 border-b border-border/40">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        
        <div className="prose prose-invert prose-p:text-text-muted prose-h2:text-text-main prose-a:text-primary max-w-none space-y-6">
          <p className="leading-relaxed">
            Welcome to ConceptIQ. These Terms of Service ("Terms") govern your access to and use of our website, services, and applications. Please read these Terms carefully before using our platform.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using ConceptIQ, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the service.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">2. User Accounts</h2>
          <p className="leading-relaxed">
            To use certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">3. Acceptable Use</h2>
          <p className="leading-relaxed">
            You agree not to use the service to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-text-muted">
            <li>Violate any applicable laws or regulations.</li>
            <li>Infringe upon the intellectual property rights of others.</li>
            <li>Attempt to reverse engineer, decompile, or hack the AI tutor or underlying systems.</li>
            <li>Share accounts or distribute access to premium features without authorization.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-4">4. Intellectual Property</h2>
          <p className="leading-relaxed">
            The service and its original content, features, algorithms, and functionality are and will remain the exclusive property of ConceptIQ and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">5. Termination</h2>
          <p className="leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the service will immediately cease.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">6. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@conceptiq.com" className="hover:underline">legal@conceptiq.com</a>.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}

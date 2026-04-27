import LandingPageBackground from "@/components/landing-page/landing-page-background"
import LandingPageCta from "@/components/landing-page/landing-page-cta"
import LandingPageFeatures from "@/components/landing-page/landing-page-features"
import LandingPageFooter from "@/components/landing-page/landing-page-footer"
import LandingPageHeader from "@/components/landing-page/landing-page-header"
import LandingPageOverview from "@/components/landing-page/landing-page-overview"
import LandingPageWorkflow from "@/components/landing-page/landing-page-workflow"

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <LandingPageBackground />

      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <LandingPageHeader />
        <LandingPageOverview />
        <LandingPageFeatures />
        <LandingPageWorkflow />
        <LandingPageCta />
        <LandingPageFooter />
      </div>
    </main>
  )
}

export default function LandingPageBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-112 bg-linear-to-b from-primary/10 via-background to-background" />
      <div className="pointer-events-none absolute -top-20 left-10 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-56 right-0 size-80 rounded-full bg-accent/40 blur-3xl" />
    </>
  )
}

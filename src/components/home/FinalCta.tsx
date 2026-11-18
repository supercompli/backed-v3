import { LinkButton } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="bg-primary-dark border-t border-white/10">
      <div className="container-page py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
          Start your Professional Indemnity application today.
        </h2>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">
          One simple online application. Specialist assistance where you need it.
        </p>
        <div className="mt-8">
          <LinkButton href="/quote" size="lg">
            Get a Quote
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

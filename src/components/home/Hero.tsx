import Image from "next/image";
import { ProfessionSelector } from "@/components/home/ProfessionSelector";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-bg border-b border-border">
      <div className="container-page relative z-10 pt-16 pb-16 md:pt-24 md:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold tracking-widest text-green uppercase mb-4">
              Professional Indemnity Insurance
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-dark leading-[1.05]">
              Professional Indemnity,
              <br />
              simplified.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed">
              Protect your professional business against claims arising from errors, omissions,
              negligence and professional advice. Choose your profession and start your
              application online.
            </p>

            <div className="mt-10 max-w-2xl">
              <p className="text-sm font-semibold text-text-dark mb-3">What do you do?</p>
              <ProfessionSelector />
              <p className="mt-4 text-sm text-text-secondary">
                No obligation &nbsp;•&nbsp; Secure application &nbsp;•&nbsp; Specialist assistance
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-accent/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-warm-bg shadow-2xl">
              <Image
                src="/team-illustration.svg"
                alt="A team of Black and white professionals collaborating"
                width={500}
                height={500}
                unoptimized
                priority
                className="h-[320px] w-full object-cover md:h-[440px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
      <p className="container-page pb-4 text-right text-[11px] text-text-secondary/70">
        Illustration by{" "}
        <a
          href="https://storyset.com/business"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-text-secondary"
        >
          Storyset
        </a>
      </p>
    </section>
  );
}

import TopBar from "../components/TopBar";

export default function Terms() {
  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Terms of Service" />
      <main className="mx-auto max-w-2xl px-4 py-10 text-sm leading-relaxed text-silver-300 sm:px-6 sm:py-14">
        <h1 className="mb-2 font-display text-2xl font-semibold uppercase tracking-[0.2em] text-white">
          Terms of Service
        </h1>
        <p className="mb-8 text-xs uppercase tracking-[0.15em] text-silver-500">Last updated: July 18, 2026</p>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Glass Cockpit Co. (the "Service"), you agree to be bound by these Terms of
              Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              2. Description of Service
            </h2>
            <p>
              Glass Cockpit Co. is a study platform intended to help pilots prepare for the FAA Private Pilot
              written knowledge test through practice questions, flashcards, and progress tracking.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              3. Not Official FAA Content, No Guarantee of Results
            </h2>
            <p>
              Glass Cockpit Co. is an independent study aid. It is not affiliated with, endorsed by, or
              administered by the Federal Aviation Administration (FAA). Question content is cross-referenced
              against publicly available FAA source material (including the Airman Certification Standards, the
              Pilot's Handbook of Aeronautical Knowledge, the Airplane Flying Handbook, and the Federal Aviation
              Regulations), but is not the official FAA test question bank, which the FAA does not publish. The
              Service is a supplement to, not a replacement for, instruction from a Certificated Flight Instructor
              and official FAA publications. We do not guarantee that use of the Service will result in passing
              any FAA test, and we are not responsible for outcomes of any actual FAA knowledge test or practical
              test.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              4. Accounts
            </h2>
            <p>
              You may use most of the Service without an account; progress is stored locally on your device. You
              may optionally sign in with a Google account to sync your progress across devices. You are
              responsible for maintaining the security of your account and for all activity under it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              5. Acceptable Use
            </h2>
            <p>
              You agree not to misuse the Service, including attempting to disrupt it, reverse-engineer it beyond
              what's permitted by law, or use it to violate any applicable law or third party's rights.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              6. Subscriptions and Payment
            </h2>
            <p>
              Glass Cockpit Co. is currently provided free of charge. If paid subscription plans are introduced in
              the future, pricing, billing frequency, and cancellation terms will be clearly presented at the time
              of purchase, and this section will be updated accordingly. Any future paid plan will be
              cancellable, and any applicable refund policy will be stated at checkout.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              7. Intellectual Property
            </h2>
            <p>
              The Service's design, software, and original written content are owned by Glass Cockpit Co.
              Underlying aeronautical facts and regulations are drawn from public-domain U.S. government sources.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              8. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "as is" and "as available," without warranties of any kind, express or
              implied, including accuracy, completeness, or fitness for a particular purpose. Aviation
              regulations and procedures change; always verify current requirements against official FAA sources
              before relying on them operationally.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Glass Cockpit Co. is not liable for any indirect,
              incidental, or consequential damages arising from your use of the Service, including any FAA test
              result or flight-related decision made in reliance on the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              10. Termination
            </h2>
            <p>
              We may suspend or terminate access to the Service for violation of these terms. You may stop using
              the Service, or delete your account data, at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              11. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the Service after changes take effect
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              12. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the State of Arkansas, without regard to conflict-of-law
              principles.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              13. Contact
            </h2>
            <p>
              Questions about these Terms can be sent to{" "}
              <a href="mailto:garrett.gb.brannon@gmail.com" className="text-silver-100 underline">
                garrett.gb.brannon@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

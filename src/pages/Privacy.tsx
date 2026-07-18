import TopBar from "../components/TopBar";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-panel-950">
      <TopBar title="Privacy Policy" />
      <main className="mx-auto max-w-2xl px-4 py-10 text-sm leading-relaxed text-silver-300 sm:px-6 sm:py-14">
        <h1 className="mb-2 font-display text-2xl font-semibold uppercase tracking-[0.2em] text-white">
          Privacy Policy
        </h1>
        <p className="mb-8 text-xs uppercase tracking-[0.15em] text-silver-500">Last updated: July 18, 2026</p>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Overview
            </h2>
            <p>
              Glass Cockpit Co. is designed to work without an account. Your study progress is stored locally in
              your browser (localStorage) and never leaves your device unless you choose to sign in. This policy
              explains what happens if you do.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Information We Collect
            </h2>
            <p className="mb-2">If you use the Service without signing in, we collect nothing on our servers.</p>
            <p>If you choose to sign in with Google, we receive and store:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Your name, email address, and profile picture, as provided by Google.</li>
              <li>
                Your study progress — quiz and exam history, category performance, and flashcard review
                scheduling — so it can sync across your devices.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              How We Use Information
            </h2>
            <p>
              Account information and study data are used solely to provide the Service to you: authenticating
              your sign-in and syncing your progress between devices. We do not use your data for advertising, and
              we do not sell or rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Where Data Is Stored
            </h2>
            <p>
              Signed-in account data is stored using Google Firebase (Authentication and Firestore), which acts as
              our infrastructure provider. Firebase's own privacy and security practices govern how that
              infrastructure handles data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Your Choices
            </h2>
            <ul className="list-disc pl-5">
              <li>You can use the Service fully without ever creating an account.</li>
              <li>
                You can export a JSON backup of your local progress, or clear all local progress, from the
                Progress page at any time.
              </li>
              <li>
                You can sign out at any time; this stops further syncing but does not delete already-synced data.
              </li>
              <li>
                To request deletion of your account and associated data, email{" "}
                <a href="mailto:garrett.gb.brannon@gmail.com" className="text-silver-100 underline">
                  garrett.gb.brannon@gmail.com
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Cookies and Local Storage
            </h2>
            <p>
              The Service uses browser localStorage to save your progress and preferences, and, if you sign in,
              standard authentication tokens required by Google Sign-In. We do not use third-party advertising or
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Children's Privacy
            </h2>
            <p>
              The Service is intended for individuals studying for an FAA knowledge test and is not directed at
              children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Your Rights
            </h2>
            <p>
              Depending on where you live, you may have rights to access, correct, or delete your personal data
              (for example, under GDPR or CCPA). Contact us at the email below to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be reflected by updating
              the date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Contact
            </h2>
            <p>
              Questions about this policy can be sent to{" "}
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

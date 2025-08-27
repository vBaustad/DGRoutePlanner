export default function Privacy() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <main className="min-h-screen bg-base-300">
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-gray-600">Last updated: {lastUpdated}</p>

        <div className="prose prose-sm md:prose-base mt-6">
          <p>
            This Privacy Policy explains how <strong>DG Route Planner</strong> (“we”, “us”) handles
            your information. We aim to collect as little personal data as possible needed to run
            the Service.
          </p>

          <h2>1. Data controller</h2>
          <p>
            The Service is operated by the project author. For privacy inquiries, please{" "}
            <a
              className="underline"
              href="https://github.com/vBaustad/DGRoutePlanner/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue on GitHub
            </a>
            .
          </p>

          <h2>2. What we collect</h2>
          <ul>
            <li>
              <strong>Usage data</strong>: Basic technical data your browser sends (e.g., IP address,
              device/browser type, pages viewed). If analytics are enabled, we use this to improve
              the Service and understand usage.
            </li>
            <li>
              <strong>Trip inputs</strong>: Start/end locations and stops you enter to generate a
              route. This is processed to return suggestions and may be temporarily cached.
            </li>
            <li>
              <strong>Support messages</strong>: If you open an issue on GitHub, we’ll receive the
              information you choose to share there.
            </li>
          </ul>

          <h2>3. Cookies & analytics</h2>
          <p>
            We may use essential cookies for core functionality (e.g., preferences) and optional
            analytics (e.g., Vercel Analytics or Google Analytics 4) to understand aggregate usage.
            Where legally required, we will request consent for non-essential cookies.
          </p>

          <h2>4. Legal bases (GDPR)</h2>
          <ul>
            <li>
              <em>Performance of a contract</em> — to provide the Service you request (route
              planning).
            </li>
            <li>
              <em>Legitimate interests</em> — to maintain and improve the Service (debugging,
              analytics in aggregate).
            </li>
            <li>
              <em>Consent</em> — where required for optional cookies/analytics or marketing.
            </li>
          </ul>

          <h2>5. Data sharing</h2>
          <p>
            We do not sell your personal data. We may share limited data with service providers who
            help us operate the Service (e.g., hosting, error logging, analytics). These providers
            are bound by confidentiality and data-processing terms.
          </p>

          <h2>6. International transfers</h2>
          <p>
            Our providers may process data in other countries. Where applicable, we rely on standard
            contractual clauses or equivalent safeguards.
          </p>

          <h2>7. Data retention</h2>
          <p>
            We keep data only as long as necessary for the purposes described above, or as required
            by law.
          </p>

          <h2>8. Your rights</h2>
          <p>
            Depending on your location (e.g., EEA/UK), you may have rights to access, correct,
            delete, or restrict processing of your personal data, and to withdraw consent where
            applicable. To exercise rights, please{" "}
            <a
              className="underline"
              href="https://github.com/vBaustad/DGRoutePlanner/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue on GitHub
            </a>
            .
          </p>

          <h2>9. Third-party links</h2>
          <p>
            The Service may link to external sites (e.g., mapping providers or disc golf resources).
            Their privacy practices are governed by their own policies.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected
            by updating the “Last updated” date.
          </p>

          <h2>11. Contact</h2>
          <p>
            For privacy questions or requests, please{" "}
            <a
              className="underline"
              href="https://github.com/vBaustad/DGRoutePlanner/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue on GitHub
            </a>
            .
          </p>

          <p className="text-xs text-gray-500">
            This page is general information and not legal advice. Consider consulting a lawyer for
            your specific compliance needs.
          </p>

          <hr />
          <p className="text-sm">
            See also our{" "}
            <a href="/terms" className="underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

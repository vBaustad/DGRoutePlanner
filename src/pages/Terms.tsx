export default function Terms() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <main className="min-h-screen bg-base-300">
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-gray-600">Last updated: {lastUpdated}</p>

        <div className="prose prose-sm md:prose-base mt-6">
          <p>
            Welcome to <strong>DG Route Planner</strong> (the “Service”). By accessing or using the
            Service, you agree to these Terms of Service (“Terms”). If you do not agree, please do
            not use the Service.
          </p>

          <h2>1. Who we are</h2>
          <p>
            DG Route Planner is a personal project that helps players plan disc golf road trips by
            suggesting courses along a route with controlled detours.
          </p>

          <h2>2. Use of the Service</h2>
          <ul>
            <li>The Service is provided for personal, non-commercial use.</li>
            <li>
              You agree not to misuse the Service, interfere with its operation, or attempt to
              access it using a method other than the interface and instructions we provide.
            </li>
            <li>
              You are responsible for complying with applicable traffic laws and local regulations.
              Always verify routes and conditions before you travel.
            </li>
          </ul>

          <h2>3. Accounts</h2>
          <p>
            If we add accounts in the future, you are responsible for the security of your login
            and any activity under it.
          </p>

          <h2>4. Course data & third-party sources</h2>
          <p>
            Course information may come from public sources or third parties and may be incomplete,
            inaccurate, or change without notice. The Service may integrate with or link to external
            services (e.g., mapping providers). We do not control those services and are not
            responsible for their content or policies.
          </p>

          <h2>5. Intellectual property</h2>
          <p>
            The Service’s software, design, and content (excluding third-party content and your own
            inputs) are owned by the author and protected by applicable laws. You may not copy,
            modify, distribute, sell, or lease any part of the Service without prior permission.
          </p>

          <h2>6. No warranty</h2>
          <p>
            The Service is provided on an “as is” and “as available” basis without warranties of any
            kind, whether express or implied (including, but not limited to, accuracy, availability,
            fitness for a particular purpose, and non-infringement).
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, DG Route Planner and its author(s) shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages, or any
            loss of profits or data, arising from your use of or inability to use the Service.
          </p>

          <h2>8. Changes to the Service or Terms</h2>
          <p>
            We may update the Service and these Terms from time to time. Continued use of the
            Service after changes take effect constitutes acceptance of the updated Terms.
          </p>

          <h2>9. Contact</h2>
          <h2>9. Contact</h2>
            <p>
            Questions about these Terms? Please{" "}
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
            your specific situation.
          </p>

          <hr />
          <p className="text-sm">
            See also our{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

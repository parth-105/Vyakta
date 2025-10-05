export const metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <main className="container-custom py-16 prose">
      <h1>Privacy Policy</h1>
      <p>We respect your privacy. This page describes how we collect, use, and protect your information.</p>
      <h2>Disclaimer</h2>
      <p>
        All information provided on this site is intended for informational and entertainment
        purposes only. While we strive for accuracy, readers should independently verify any
        guidance or claims with authoritative and authenticated sources before acting on them.
        The site, its authors, and handlers are not liable for any loss or damage resulting
        from the use of information provided here.
      </p>
      <h2>Information We Collect</h2>
      <p>Basic analytics, server logs, and data you submit via forms.</p>
      <h2>How We Use Information</h2>
      <p>To improve the site, provide support, and communicate updates.</p>
      <h2>Contact</h2>
      <p>If you have questions, contact us via the form on the contact page.</p>
    </main>
  );
}



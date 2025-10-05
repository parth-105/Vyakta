export const metadata = {
  title: 'Terms of Service',
  description: 'The rules and guidelines for using this website.',
};

export default function TermsPage() {
  return (
    <main className="container-custom py-16 prose">
      <h1>Terms of Service</h1>
      <p>By using this website, you agree to the following terms and conditions.</p>
      <h2>Disclaimer</h2>
      <p>
        Content on this website is provided for informational and entertainment purposes only.
        Readers should verify details with authenticated sources before relying on them.
        The site and its handlers assume no responsibility for errors, omissions, or outcomes
        resulting from use of the information provided.
      </p>
      <h2>Use of Content</h2>
      <p>Content is provided for informational purposes. Do not misuse the site or its content.</p>
      <h2>Liability</h2>
      <p>We make no warranties and are not liable for damages arising from use of the site.</p>
    </main>
  );
}



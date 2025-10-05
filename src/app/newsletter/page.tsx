export const metadata = {
  title: 'Newsletter',
  description: 'Subscribe to get the latest articles in your inbox.',
};

export default function NewsletterPage() {
  return (
    <main className="container-custom py-16">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h1>
        <p className="text-gray-600 mb-8">No spam. Unsubscribe anytime.</p>
        <div className="text-sm text-gray-500 mb-6 text-left">
          <p>
            Disclaimer: The content shared via our newsletter is for informational and
            entertainment purposes only. Please verify any advice or claims with
            authenticated sources before acting. The site and its handlers are not
            responsible for any outcomes resulting from its use.
          </p>
        </div>
        <form className="flex">
          <input type="email" required placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-l-lg border" />
          <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-r-lg">Subscribe</button>
        </form>
      </div>
    </main>
  );
}



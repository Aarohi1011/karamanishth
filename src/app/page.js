export default function Home() {
  return (
    <main className="bg-[#F5EEDD] text-[#06202B]">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-[#7AE2CF] via-[#DDA853] to-[#F5EEDD]">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#06202B]">
          Smart QR-Based Attendance System
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-[#16404D] mb-8">
          Let your employees clock in & out with a simple QR scan.
          Full insights & analytics dashboard for management. Effortless. Accurate. Instant.
        </p>
        <button className="bg-[#077A7D] text-white px-6 py-3 rounded-xl text-lg hover:bg-[#06202B] transition">
          Get Started Free
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#06202B]">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-[#FBF5DD] p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-2">1. Scan to Clock In</h3>
            <p>Employees scan the QR code when they arrive to mark their attendance automatically.</p>
          </div>
          <div className="bg-[#FBF5DD] p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-2">2. Scan to Clock Out</h3>
            <p>Scan again when leaving—accurate tracking of work hours without manual entries.</p>
          </div>
          <div className="bg-[#FBF5DD] p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-2">3. Admin Dashboard</h3>
            <p>Real-time analytics, attendance summaries, late logins, and export-ready reports.</p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-[#A6CDC6] text-center">
        <h2 className="text-3xl font-bold mb-6">Modern Dashboard for Management</h2>
        <p className="text-lg max-w-3xl mx-auto mb-12 text-[#16404D]">
          Visualize team attendance, detect patterns, and make informed decisions. 
          All in one smart dashboard.
        </p>
        <div className="w-full max-w-4xl mx-auto aspect-video bg-white rounded-xl shadow-2xl flex items-center justify-center text-[#077A7D] text-xl">
          [ Dashboard Preview Image or Placeholder ]
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["This system changed our workflow!", "So easy to use.", "Insightful analytics!"].map((quote, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <p className="italic">“{quote}”</p>
              <span className="block mt-4 text-sm text-[#16404D]">– Employee {i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#06202B] text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Start Managing Attendance Smarter</h2>
        <p className="text-lg mb-8">
          Simple setup. Full control. Try it free today.
        </p>
        <button className="bg-[#7AE2CF] text-[#06202B] px-6 py-3 rounded-xl text-lg hover:bg-[#A6CDC6] transition">
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#16404D] text-white py-12 text-center px-4">
        <h3 className="text-xl font-semibold">QR Attendance SaaS</h3>
        <p className="text-sm mt-2">© {new Date().getFullYear()} All rights reserved.</p>
        <div className="mt-4 text-sm space-x-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </main>
  )
}

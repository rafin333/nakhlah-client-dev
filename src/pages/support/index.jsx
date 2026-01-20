import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

// Toast Component
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-all">
      {message}
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div
    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
    onClick={() => onToggle(faq.id)}
  >
    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-[#624d88]">{faq.attributes.question}</h3>
      <span className="text-xl">{isOpen ? "−" : "+"}</span>
    </div>
    {isOpen && (
      <p className="text-sm mt-2 text-gray-600 whitespace-pre-line">
        {faq.attributes.answer}
      </p>
    )}
  </div>
);

function SupportPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("https://devapi.siamrtx.space/api/faqs");
        const json = await res.json();
        setFaqs(json.data);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = id => setOpenId(prev => (prev === id ? null : id));

  const handleFeedbackSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch("https://devapi.siamrtx.space/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMail: userEmail, mailBody: feedback }),
      });

      if (!res.ok) throw new Error("Failed to send feedback");

      setToast("Feedback sent successfully");
      setUserEmail("");
      setFeedback("");
    } catch {
      setToast("Something went wrong");
    }
  };

  return (
    <>
      <Head>
        <title>Nakhlah Support</title>
      </Head>

      <Toast message={toast} onClose={() => setToast("")} />

      <div className="flex flex-col items-center min-h-screen p-6 bg-[#f8f1db]">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/50">

          <h1 className="text-3xl font-bold mb-6 text-center text-[#229B59]">
            Nakhlah App Support
          </h1>

          <div className="space-y-10 text-gray-700">
            <p className="text-center text-lg">
              Here’s everything you need if you’re stuck or confused.
            </p>

            {/* Contact Support */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#CB8F15]">
                Contact Support
              </h2>
              <p className="mb-4">If something isn’t working as expected, tell us.</p>
              <p className="flex items-center mb-2">
                <span className="font-semibold w-24">Email:</span>
                <a href="mailto:support@nakhlah-lms.com" className="text-blue-600 hover:underline">
                  support@nakhlah.net
                </a>
              </p>
            </div>

            {/* Feedback Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-6">
              <h2 className="text-xl font-bold mb-4 text-[#CB8F15]">Send Feedback</h2>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#229B59] focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Your Feedback</label>
                  <textarea
                    required
                    rows={4}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#229B59] focus:outline-none"
                    placeholder="Write your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#229B59] text-white rounded-lg shadow hover:bg-[#1f8a4f] transition"
                >
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4 text-[#CB8F15]">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map(faq => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openId === faq.id}
                    onToggle={toggleFAQ}
                  />
                ))}
              </div>
            </div>

            {/* Support Instructions */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#CB8F15]">Support Instructions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keep your Nakhlah app updated.</li>
                <li>Attach screenshots when reporting an issue.</li>
                <li>Explain the steps that caused the issue.</li>
                <li>Check FAQ before contacting support.</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/">
              <button className="popbuttonPrimary">Back to Home</button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default SupportPage;

// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
      <p className="text-lg mb-6 text-center max-w-md">
        Have questions, inquiries, or just want to say hi? Drop us a message and we’ll get back to you shortly.
      </p>
      <form className="w-full max-w-md space-y-4">
        <label htmlFor="" className="pb-2 pl-1">Name</label>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border border-gray-300 shadow-md hover:border-blue-500 transition transition-duration-800 rounded-xl"
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border border-gray-300 shadow-md hover:border-blue-500 transition transition-duration-800 rounded-xl"
        />
        <label htmlFor="" className="pb-2 pl-1">Message</label>
        <textarea
          placeholder="Your Message"
          className="w-full p-3 border border-gray-300 shadow-md hover:border-blue-500 transition transition-duration-800 rounded-xl min-h-[150px]"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

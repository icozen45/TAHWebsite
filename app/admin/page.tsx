'use client'

export default function AdminHomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Welcome to the Admin Dashboard</h1>

      <p className="mb-4">
        This section of the site is reserved for internal administrative tools, analytics, and content
        management functionality. It provides authorized team members with access to manage key
        components of the Global Project Solutions website, including blogs, reviews, analytics, and
        additional utilities.
      </p>

      <p className="mb-4">
        Please note that this dashboard is not intended for public use or promotional content. It is
        built with simplicity and control in mind, allowing the core team to manage website content,
        monitor performance, and make backend updates without relying on external systems.
      </p>

      <p className="mb-4">
        We’ve stripped away any flashy animations or visual flair here to keep things focused. What
        matters is clarity, control, and ease of use. Each section of the admin panel can be accessed
        using the navigation menu or the dedicated folders in the codebase.
      </p>

      <p className="mb-4">
        If you're looking for data-heavy metrics, feature toggles, or content input forms, you’ll find
        them under their respective tabs — such as Blogs, Reviews, or Analytics. Additional tools may
        also be added over time to streamline internal workflows.
      </p>

      <p className="mb-4">
        As always, if you encounter any issues, please contact the development lead or report them via
        the designated internal support channel.
      </p>

      <p className="mt-10 text-sm text-gray-500 italic">
        This page is meant purely for internal purposes and is not indexed by search engines.
      </p>
    </div>
  )
}

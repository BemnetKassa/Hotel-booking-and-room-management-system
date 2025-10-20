export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} HotelEase. All Rights Reserved.</p>
        <p className="text-sm mt-2">
          Built with ❤️ using Next.js + Node.js + PostgreSQL
        </p>
      </div>
    </footer>
  );
}

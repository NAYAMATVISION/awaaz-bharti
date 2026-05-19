import Link from "next/link";

const categoryLinks = [
  { label: "Politics", href: "/category/politics" },
  { label: "Business", href: "/category/business" },
  { label: "Technology", href: "/category/technology" },
  { label: "Sports", href: "/category/sports" },
  { label: "Entertainment", href: "/category/entertainment" },
  { label: "World", href: "/category/world" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Advertise", href: "/advertise" },
  { label: "Press Kit", href: "/about" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Grievance", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 mt-12">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-6 sm:gap-9">
          {/* Brand */}
          <div>
            <div className="text-2xl font-black mb-3">
              <span className="text-red-600">Awaz</span>
              <span className="text-white">Bharti</span>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-500">
              India&apos;s most trusted digital news platform delivering unbiased, in-depth coverage of politics,
              business, technology, sports, and entertainment. Your voice, our commitment.
            </p>
            <div className="flex gap-2.5 mt-5">
              {["Facebook", "Twitter", "YouTube", "Instagram"].map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="w-[38px] h-[38px] rounded-full bg-white/[.08] flex items-center justify-center transition-all hover:bg-red-700 hover:-translate-y-0.5"
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Categories" links={categoryLinks} />
          <FooterCol title="Company" links={companyLinks} />
          <FooterCol title="Legal" links={legalLinks} />
        </div>

        <div className="mt-9 py-[18px] border-t border-white/[.08] flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <span>© 2026 Awaz Bharti. All rights reserved.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[13px] text-gray-500 hover:text-red-400 hover:pl-1 transition-all leading-relaxed">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ name }) {
  const icons = {
    Facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    Twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    YouTube: <path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29.3 29.3 0 0 0 1 12a29.3 29.3 0 0 0 .5 5.6 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2A29.3 29.3 0 0 0 23 12a29.3 29.3 0 0 0-.5-5.6zM9.8 15.5V8.5l5.6 3.5-5.6 3.5z" />,
    Instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </>
    ),
  };

  return (
    <svg className="w-4 h-4 fill-gray-300" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}

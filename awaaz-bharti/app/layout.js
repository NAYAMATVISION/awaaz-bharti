import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Awaz Bharti — India's Voice",
  description:
    "Awaz Bharti delivers breaking news, politics, business, sports and entertainment coverage from India and around the world.",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

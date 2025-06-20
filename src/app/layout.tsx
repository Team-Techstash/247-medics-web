import type { Metadata } from "next";
import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/redux/reduxProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LocationAccess from "./components/LocationAccess";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Add required font weights
  variable: "--font-ubuntu", // Define a CSS variable
});

export const metadata: Metadata = {
  title: "Medics",
  description: "27/7 Care Anywhere Anytime",
};

// Get the client ID from environment variables
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.error('Google Client ID is not defined in environment variables');
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={clientId || '468261695968-kj1ihjttsagk24udd7lpj00hmjvq5nvq.apps.googleusercontent.com'}>
          <ReduxProvider>
            <LocationAccess />
            <Toaster
              toastOptions={{
                success: {
                  iconTheme: {
                    primary: '#9904A1',
                    secondary: '#E0F2FE',
                  },
                  style: {
                    border: '1px solid primary',
                    padding: '12px 16px',
                    color: '#1E3A8A',
                  },
                },
                error: {
                  style: {
                    border: '1px solid #EF4444',
                    padding: '12px 16px',
                    color: '#991B1B',
                  },
                },
                loading: {
                  style: {
                    border: '1px solid #FBBF24',
                    padding: '12px 16px',
                    color: '#92400E',
                  },
                },
              }}
              position="top-right"
            />
            {children}
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

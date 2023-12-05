import { AppProps } from "next/app";
import "../styles/globals.css";

import { Inter } from "next/font/google";
const font = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          body {
            font-family: ${font.style.fontFamily}, sans-serif;
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}

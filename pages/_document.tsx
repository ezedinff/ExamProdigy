import { Head, Html, Main, NextScript } from "next/document";

export default function Document () {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Exam preparation for cetifications" />
        <meta name="author" content="Ezedin Fedlu" />
      </Head>
      <body className="bg-gray-100 dark:bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
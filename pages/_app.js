import Head from "next/head";
import { SWRConfig } from "swr";

import "styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Фотоальбом КЗШ І-ІІІ ст. №55</title>
      </Head>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

function fetcher(...urls) {
  const f = (u) => fetch(u).then((r) => r.json());

  if (urls.length > 1) {
    return Promise.all(urls.map(f));
  }
  return f(urls);
}

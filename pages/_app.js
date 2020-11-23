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
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

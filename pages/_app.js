import Layout from "components/layout";
import { SWRConfig } from "swr";

import "styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <Layout title="Фотоальбом КЗШ І-ІІІ ст. №55">
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </Layout>
  );
}

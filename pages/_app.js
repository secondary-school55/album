import Layout from "components/layout";

import "styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <Layout title="Фотоальбом КЗШ І-ІІІ ст. №55">
      <Component {...pageProps} />
    </Layout>
  );
}

import React from "react";
import Head from "next/head";

export default ({ children, title }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			{children}
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css?family=PT+Serif&display=swap");

				body {
					font-family: PT Serif;
					margin: 0;
					padding: 0;
					overflow-y: visible;
				}
				a {
					text-decoration: none;
					color: blue;
				}
			`}</style>
		</>
	);
};

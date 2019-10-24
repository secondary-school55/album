import React from "react";

export default ({ children }) => {
	return (
		<>
			{children}
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|&display=swap");

				body {
					font-family: PT Serif;
					margin: 0;
					padding: 0;
				}
				a {
					text-decoration: none;
					color: blue;
				}
			`}</style>
		</>
	);
};

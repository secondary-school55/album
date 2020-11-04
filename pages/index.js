import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loader from "react-loader-spinner";
import PhotoGallery, { fromList } from "components/photo-gallery";

export default function Index() {
	const router = useRouter();
	const { id } = router.query;

	const [data, setData] = useState({ photos: [], album: [] });
	const [text, setText] = useState("");

	const isEmpty = () => data.photos.length === 0 && data.album.length === 0;

	useEffect(() => {
		getData().then((data) => setData(data));
	}, []);

	switch (true) {
		case isEmpty():
			return (
				<>
					<div>
						<Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
					</div>
					<style jsx>{`
						div {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100%;
							height: 100vh;
						}
					`}</style>
				</>
			);

		case id !== undefined:
			return <PhotoGallery id={id} data={data} />;
	}
	return <List album={data.album} text={text} setText={setText} />;
}

function List({ album, text, setText }) {
	return (
		<>
			<Filter album={album} text={text} setText={setText}>
				{(album) => (
					<div className="grid">
						{album.map((item, i) => (
							<React.Fragment key={item.id}>
								<div className="date">
									{`${item.date.day}.${item.date.month}.${item.date.year}`}
								</div>
								<div>
									<Link href={`?id=${item.id}`}>
										<a
											className="title"
											dangerouslySetInnerHTML={{ __html: item.title }}
										/>
									</Link>
								</div>
							</React.Fragment>
						))}
					</div>
				)}
			</Filter>
			<style jsx>{`
				.grid {
					display: grid;
					grid-template-columns: auto 1fr;
					font-size: 1.7vw;
				}

				.date {
					margin-right: 1vw;
				}

				.title :global(.highlight) {
					color: red;
				}
			`}</style>
		</>
	);
}

function Filter({ album, text, setText, children }) {
	const textLower = text.toLowerCase();
	const data = album
		.filter(
			(item) =>
				item.titleLower.includes(textLower) || item.dateStr.includes(text)
		)
		.map((item) => {
			if (textLower.length === 0) return item;
			const pos = item.titleLower.indexOf(textLower);

			const begin = item.title.slice(0, pos);
			const middle = item.title.slice(pos, pos + textLower.length);
			const end = item.title.slice(pos + textLower.length);

			return {
				...item,
				title: `${begin}<span class="highlight">${middle}</span>${end}`,
			};
		});

	return (
		<>
			<input
				type="search"
				placeholder="Пошук"
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			{children(data)}
			<style jsx>{`
				input {
					border: 0;
					border-bottom: 1px solid black;
					box-sizing: border-box;
					font-size: 1.4vw;
					width: 100%;
					position: sticky;
					left: 0;
					top: 0;
				}
			`}</style>
		</>
	);
}

async function getData() {
	const [photos, album] = await Promise.all([
		fetch("https://api.school55.pp.ua/photos.json").then((r) => r.json()),
		fetch("https://school55.pp.ua/album.json").then((r) => r.json()),
	]);

	album.reverse();

	for (const item of album) {
		const id = item.date.id !== undefined ? `-${item.date.id}` : "";
		item.id = `${item.date.year}-${item.date.month}-${item.date.day}${id}`;
		item.dateStr = `${item.date.day}.${item.date.month}.${item.date.year}`;
		item.titleLower = item.title.toLowerCase();
	}

	return { photos, album };
}

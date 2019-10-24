import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loader from "react-loader-spinner";
import Layout from "c/Layout";
import PhotoGallery from "c/PhotoGallery";

export default () => {
	const router = useRouter();
	const { id } = router.query;

	const [data, setData] = useState({ photos: [], album: [] });
	const [text, setText] = useState("");

	const isEmpty = () => data.photos.length === 0 && data.album.length === 0;

	useEffect(() => {
		getData().then(data => setData(data));
	}, []);

	return (
		<Layout>
			{id !== undefined ? (
				<PhotoGallery id={id} data={data} />
			) : (
				<List
					album={data.album}
					text={text}
					setText={setText}
					isEmpty={isEmpty}
				/>
			)}
		</Layout>
	);
};

function List({ album, text, setText, isEmpty }) {
	if (isEmpty())
		return (
			<>
				<div>
					<Loader
						type="ThreeDots"
						color="#00BFFF"
						height={100}
						width={100}
					/>
				</div>
				<style jsx>{`
					div {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100vh;
					}
				`}</style>
			</>
		);

	return (
		<>
			<Filter album={album} text={text} setText={setText}>
				{album => (
					<div className="grid">
						{album.map(item => (
							<React.Fragment key={item.id}>
								<div className="date">
									{item.date.day}.{item.date.month}.
									{item.date.year}
								</div>
								<div>
									<Link href={`?id=${item.id}`}>
										<a>{item.title}</a>
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
			`}</style>
		</>
	);
}

function Filter({ album, text, setText, children }) {
	const data = album.filter(
		item => item.title.includes(text) || item.dateStr.includes(text)
	);
	return (
		<>
			<input onChange={e => setText(e.target.value)} value={text} />
			{children(data)}
			<style jsx>{`
				input {
					font-size: 1.2vw;
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
		fetch("https://api.school55.pp.ua/photos.json").then(r => r.json()),
		fetch("https://school55.pp.ua/album.json").then(r => r.json())
	]);

	album.reverse();

	for (const item of album) {
		const id = item.date.id !== undefined ? `-${item.date.id}` : "";
		item.id = `${item.date.year}-${item.date.month}-${item.date.day}${id}`;
		item.dateStr = `${item.date.day}.${item.date.month}.${item.date.year}`;
	}

	return { photos, album };
}

import React from "react";
import Link from "next/link";
import Router from "next/router";
import Gallery from "react-photo-gallery";
import { LazyLoadImage } from "react-lazy-load-image-component";
import localCompare from "locale-compare";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "react-loader-spinner";
import useSWR from "swr";

import Loading from "components/loading";

export default function PhotoGallery({ id, album }) {
	const data = usePhotos(id, album);
	if (!data) return <Loading />;

	const { photos, date, title, total } = data;

	return (
		<>
			<Header title={title} date={date} total={total} />
			<Gallery photos={photos} margin={1} renderImage={renderImage(photos)} />
		</>
	);
}

function Header({ title, date, total }) {
	return (
		<div className="root">
			<div className="back" onClick={() => Router.back()}>
				<FaArrowLeft />
			</div>

			{total > 0 && (
				<>
					<div className="date">
						{date.day}.{date.month}.{date.year}
					</div>
					<div className="title">{title}</div>
					<div className="total">({total} фото)</div>
				</>
			)}

			<style jsx>{`
				.root {
					position: sticky;
					display: flex;
					align-items: center;
					flex-direction: column;
					left: 0;
					top: 0;
					width: 100%;
					background-color: rgba(0, 0, 0, 0.75);
					z-index: 1;
					color: white;
					font-size: 1.3vw;
				}

				.back {
					font-size: 1.4vw;
					width: auto;
					z-index: 2;
					cursor: pointer;
					position: absolute;
					top: 50%;
					left: 0.5vw;
					transform: translateY(-50%);
					background-color: transparent;
				}

				.date {
					color: #00f3ff;
				}

				.total {
					color: #53ff1b;
				}

				.title,
				.total,
				.date {
					text-align: center;
					width: 100%;
				}

				.title {
					width: 95%;
				}
			`}</style>
		</div>
	);
}

function renderImage(items) {
	return ({ index, key, photo }) => {
		return (
			<React.Fragment key={key}>
				<LazyLoadImage
					width={photo.width}
					height={photo.height}
					src={photo.src}
					className="photo"
					onClick={() => window.open(items[index].download)}
				/>
				<style jsx>{`
					:global(.photo) {
						display: block;
						box-sizing: border-box;
						border: 1px solid transparent;
						transition: all 100ms ease-in-out;
					}

					:global(.photo:hover) {
						filter: brightness(0.5);
						cursor: pointer;
					}
				`}</style>
			</React.Fragment>
		);
	};
}

function usePhotos(id, album) {
	const item = album.find((item) => item.id == id);
	if (item === undefined) return { title: "", date: "", photos: [], total: 0 };

	const { data } = useSWR(
		`https://api.school55.pp.ua/api/albums/${item.slideshows[0]}`
	);
	if (!data) return undefined;

	const photos = data.map((photo) => ({
		src: photo.preview_url,
		download: photo.download_url,
		width: photo.width,
		height: photo.height,
		id: photo.public_id,
	}));

	const lc = localCompare();

	photos.sort((a, b) => lc(a.id, b.id));

	return {
		title: item.title,
		date: item.date,
		total: photos.length,
		photos,
	};
}

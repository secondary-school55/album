import React from "react";
import Link from "next/link";
import Router from "next/router";
import Gallery from "react-photo-gallery";
import { LazyLoadImage } from "react-lazy-load-image-component";
import localCompare from "locale-compare";
import { FaArrowLeft } from "react-icons/fa";

export default ({ id, data }) => {
	const { photos, date, title, total } = findPhotos(id, data);
	return (
		<>
			<Header title={title} date={date} total={total} />
			{photos.map((items, i) => (
				<div key={i}>
					<Gallery
						photos={items}
						margin={1}
						renderImage={renderImage(items)}
					/>
				</div>
			))}
		</>
	);
};

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

function findPhotos(id, data) {
	const { photos, album } = data;

	const item = album.find(item => item.id === id);
	if (item === undefined)
		return { title: "", date: "", photos: [], total: 0 };

	const lc = localCompare();

	const photos_filtered = item.slideshows.map(s => {
		const p = photos
			.filter(photo => photo.public_id.split("/")[0] === s)
			.map(photo => ({
				src: photo.preview_url,
				download: photo.download_url,
				width: photo.width,
				height: photo.height,
				id: photo.public_id
			}));

		p.sort((a, b) => lc(a.id, b.id));

		return p;
	});

	const total = photos_filtered.reduce((a, b) => a + b.length, 0);

	return {
		title: item.title,
		date: item.date,
		total,
		photos: photos_filtered
	};
}

import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Virtuoso } from "react-virtuoso";
import useSWR, { mutate } from "swr";

import PhotoGallery, { fromList } from "components/photo-gallery";
import Loading from "components/loading";

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const [text, setText] = useState("");
  const album = useAlbum();

  if (!album) return <Loading />;

  if (id !== undefined) return <PhotoGallery id={id} album={album} />;
  return <List album={album} text={text} setText={setText} />;
}

function List({ album, text, setText }) {
  const filter = useMemo(() => {
    const textLower = text.toLowerCase();
    return album
      .filter((item) => item.titleLower.includes(textLower))
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
  }, [text]);

  return (
    <>
      <input
        type="search"
        placeholder="Пошук"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <Virtuoso
        style={{ width: "100%", height: "95vh", fontSize: "1.7vw" }}
        totalCount={filter.length}
        item={(i) => {
          const item = filter[i];

          return (
            <div className="row">
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
            </div>
          );
        }}
      />
      <style jsx>{`
        input {
          border: 0;
          border-bottom: 1px solid black;
          box-sizing: border-box;
          font-size: 1.4vw;
          width: 100%;
          height: 2vw;
          position: sticky;
          left: 0;
          top: 0;
        }

        input:focus {
          outline: none;
        }

        .row {
          display: flex;
          flex-flow: row;
        }

        .date {
          margin-right: 1vw;
        }

        .title {
        }

        .title :global(.highlight) {
          background-color: yellow;
        }
      `}</style>
    </>
  );
}

function useAlbum() {
  const { data } = useSWR("https://school55.pp.ua/album.json");
  if (!data) return null;

  const album = [...data];
  album.reverse();

  for (const item of album) {
    const id = item.date.id !== undefined ? `-${item.date.id}` : "";
    item.id = `news-${item.date.year}-${item.date.month}-${item.date.day}${id}`;
    item.dateStr = `${item.date.day}.${item.date.month}.${item.date.year}`;
    item.titleLower = item.title.toLowerCase();
  }

  return album;
}

import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList() {
  return (
    <ImageList
      sx={{ width: '100%', height: 'auto', maxWidth: 500, margin: 'auto' }}
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
            style={{ borderRadius: '8px' }} 
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: require("../assets/realmadrid.jpg"),
    title: 'Real Madrid',
    rows: 2,
    cols: 2,
  },
  {
    img: require("../assets/manchester-united-6557374.jpg"),
    title: 'Manchester United',
  },
  {
    img: require("../assets/football-488714.jpg"),
    title: 'Football',
  },
  {
    img: require("../assets/football-stadium-254443.jpg"),
    title: 'Stadium',
    cols: 2,
  },
  {
    img: require("../assets/football-83222.jpg"),
    title: 'Football Match',
    cols: 2,
  },
  {
    img: require("../assets/football-stadium-3952062.jpg"),
    title: 'Stadium View',
    rows: 2,
    cols: 2,
  },
  {
    img: require("../assets/football-6556442.jpg"),
    title: 'Basketball',
  },
  {
    img: require("../assets/kids-3503767.jpg"),
    title: 'Kids Playing',
  },
];
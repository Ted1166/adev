import React from 'react';
import { Stack, Text, Image } from '@mantine/core';

// Sample images (you can adjust paths based on your project structure)
import image1 from '/ui/image1.png';
import image2 from '/ui/image2.png';
import image3 from '/ui/image3.png';
import image4 from '/ui/image4.png';
import image5 from '/ui/image5.png';

const MovieScroll = () => {
  const movies = [
    { id: 1, title: "Movie 1", image: image1, rating: "4.5" },
    { id: 2, title: "Movie 2", image: image2, rating: "4.8" },
    { id: 3, title: "Movie 3", image: image3, rating: "4.2" },
    { id: 4, title: "Movie 4", image: image4, rating: "4.7" },
    { id: 5, title: "Movie 5", image: image5, rating: "4.6" },
  ];

  return (
    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0' }}>
      {movies.map((movie) => (
        <Stack
          key={movie.id}
          align="center"
          style={{
            minWidth: '200px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '1rem',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s',
          }}
          className="movie-item"
        >
          <Image src={movie.image} alt={movie.title} width={180} height={270} fit="cover" radius="md" />
          <Text color="white" weight={500} align="center" style={{ marginTop: '0.5rem' }}>{movie.title}</Text>
          <Text color="yellow" size="sm">⭐ {movie.rating}</Text>
        </Stack>
      ))}
    </div>
  );
};

export default MovieScroll;

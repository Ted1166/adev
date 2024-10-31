import React from 'react';
import { Stack, Text, Image } from '@mantine/core';

import image1 from '/ui/image1.png';
import image2 from '/ui/image2.png';
import image3 from '/ui/image3.png';
import image4 from '/ui/image4.png';
import image5 from '/ui/image5.png';

import './MovieScroll.css';

const MovieScroll = () => {
    const images = [image1, image2, image3, image4, image5];
  
    return (
      <div className="movie-scroll-container">
        <div className="movie-scroll-track">
          {images.map((image, index) => (
            <div key={index} className="movie-item">
              <Image src={image} alt={`Movie ${index + 1}`} width={220} height={330} fit="cover" radius="lg" />
            </div>
          ))}
        </div>
      </div>
    );
  };

export default MovieScroll;

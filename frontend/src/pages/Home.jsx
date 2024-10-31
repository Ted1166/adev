import React from 'react';
import { Center, Grid, Image, Stack, Title, Text, Button } from '@mantine/core';
import MovieScroll from './MovieScroll';

const Home = () => {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Center style={{ height: '70vh', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(75,0,130,0.5), rgba(138,43,226,0.5), rgba(255,20,147,0.5))' }} />
        <Stack align="center" spacing="md" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <Title order={1} style={{ fontSize: '4rem', color: 'transparent', backgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #4b0082, #8a2be2, #ff1493)' }}>
            ADEV FUNTIME
          </Title>
          <Text color="gray.1" size="xl" align="center">
            Your Gateway to Endless Entertainment! Subscribe to an array of captivating channels curated by talented content creators.
          </Text>
          <Button size="lg" color="indigo" radius="xl" variant="gradient" gradient={{ from: 'indigo', via: 'purple', to: 'pink' }}>
            Explore Now
          </Button>
        </Stack>
      </Center>

      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 20 }}>
        <Center>
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem', overflowX: 'auto' }}>
            {['Trending', 'Movies', 'Series', 'Gaming', 'Education', 'Technology'].map((tab) => (
              <Button key={tab} variant="subtle" color="gray.4">
                {tab}
              </Button>
            ))}
          </div>
        </Center>
      </div>

      <Stack spacing="xl" style={{ padding: '2rem' }}>
        <Stack>
          <Title order={2} style={{ color: 'white' }}>
            Featured Content
          </Title>
          <MovieScroll />
        </Stack>

        <Title order={2} style={{ color: 'white' }}>
          Popular Channels
        </Title>
        <Grid gutter="lg">
          {[1, 2, 3].map((channel) => (
            <Grid.Col xs={12} md={6} lg={4} key={channel}>
              <Stack align="center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(128, 0, 128, 0.2)' }}>
                <Center style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(75, 0, 130, 0.2)', borderRadius: '50%' }}>
                  <Text size="xl" style={{ color: '#fff' }}>📺</Text>
                </Center>
                <Title order={3} style={{ color: 'white' }}>Channel {channel}</Title>
                <Text color="gray.4">1.2M Subscribers</Text>
                <Text color="gray.3" align="center">Experience amazing content from our top creators.</Text>
                <Button variant="light" color="indigo">Subscribe</Button>
              </Stack>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </div>
  );
};

export default Home;

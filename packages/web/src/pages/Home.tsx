import React from 'react';
import GiphyMain from '../components/giphy/GiphyMain';
import PageWrapper from '../components/page-wrapper/PageWrapper';

const Home = (): JSX.Element => (
  <PageWrapper title="Home">
    <>
      <GiphyMain />
    </>
  </PageWrapper>
);

export default Home;

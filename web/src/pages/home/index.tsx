import { PageContainer } from '@/layouts/components/page-container';
import { Applications } from './applications';
import { NextBanner } from './banner';
import { Datasets } from './datasets';

const Home = () => {
  return (
    <PageContainer className="px-5 py-6 lg:px-8">
      <article className="mx-auto max-w-[1440px]">
        <header className="mb-8">
          <NextBanner />
        </header>

        <Datasets />
        <Applications />
      </article>
    </PageContainer>
  );
};

export default Home;

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import CompressPdfUploader from '@/components/CompressPdfUploader';

export default function CompressPdf() {
  return (
    <Layout>
      <CompressPdfUploader />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'de', ['common'])),
    },
  };
};

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';

export default function ImageToPdf() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <FileUploader
        endpoint="/api/image-to-pdf"
        accept={{
          'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
        }}
        multiple={true}
        title={t('tools.imageToPdf.title')}
      />
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

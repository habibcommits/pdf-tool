import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';

export default function MergePdf() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <FileUploader
        endpoint="/api/merge-pdf"
        accept={{
          'application/pdf': ['.pdf']
        }}
        multiple={true}
        title={t('tools.mergePdf.title')}
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

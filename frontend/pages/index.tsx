import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { FiImage, FiLayers, FiArchive } from 'react-icons/fi';

export default function Home() {
  const { t } = useTranslation('common');

  const tools = [
    {
      title: t('tools.imageToPdf.title'),
      description: t('tools.imageToPdf.description'),
      href: '/image-to-pdf',
      icon: FiImage,
      color: 'bg-blue-500',
    },
    {
      title: t('tools.mergePdf.title'),
      description: t('tools.mergePdf.description'),
      href: '/merge-pdf',
      icon: FiLayers,
      color: 'bg-green-500',
    },
    {
      title: t('tools.compressPdf.title'),
      description: t('tools.compressPdf.description'),
      href: '/compress-pdf',
      icon: FiArchive,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 hover:border-primary"
            >
              <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <tool.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-600">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Über PDF Tools</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Einfach zu bedienen</h3>
              <p className="text-sm">Intuitiv gestaltete Tools für maximale Benutzerfreundlichkeit.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">100% kostenlos</h3>
              <p className="text-sm">Alle Tools können Sie kostenlos und ohne Einschränkungen nutzen.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Sicherheit</h3>
              <p className="text-sm">Dateien werden verschlüsselt übertragen und automatisch gelöscht.</p>
            </div>
          </div>
        </div>
      </div>
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

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import Loader from './Loader';

export default function CompressPdfUploader() {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dpi, setDpi] = useState(144);
  const [imageQuality, setImageQuality] = useState(75);
  const [colorMode, setColorMode] = useState('no-change');

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setDownloadUrl(null);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dpi', dpi.toString());
    formData.append('image_quality', imageQuality.toString());
    formData.append('color_mode', colorMode);

    try {
      const response = await axios.post('/api/compress-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(t('upload.error'));
      console.error('Upload error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {t('tools.compressPdf.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {t('compress.subtitle')}
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-green-600 font-semibold">✓</span> {t('compress.free')}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-600 font-semibold">✓</span> {t('compress.online')}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-600 font-semibold">✓</span> {t('compress.noLimits')}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-600 font-semibold">✓</span> {t('compress.secure')}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-blue-50'
                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto text-5xl text-gray-400 mb-4" />
            <p className="text-gray-600">{t('upload.dragDrop')}</p>
          </div>

          {file && !processing && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{t('compress.selectedFile')}:</h3>
              <div className="bg-gray-100 rounded p-4">
                <p className="text-sm text-gray-700">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              </div>
              
              <button
                onClick={handleUpload}
                className="mt-4 w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('compress.compress')}
              </button>
            </div>
          )}

          {processing && (
            <div className="mt-8 p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Loader size="large" text={t('upload.processing')} />
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {downloadUrl && (
            <div className="mt-6 p-6 bg-green-100 border border-green-400 rounded-lg">
              <p className="text-green-800 font-semibold mb-4">{t('compress.complete')}</p>
              <a
                href={downloadUrl}
                download="compressed.pdf"
                className="inline-flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <FiDownload />
                {t('upload.download')}
              </a>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h3 className="font-bold text-lg mb-4 text-gray-900">{t('compress.settings')}</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DPI
              </label>
              <input
                type="range"
                min="72"
                max="300"
                step="1"
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>72</span>
                <span className="font-semibold text-primary">{dpi}</span>
                <span>300</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('compress.imageQuality')}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={imageQuality}
                onChange={(e) => setImageQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>10%</span>
                <span className="font-semibold text-primary">{imageQuality}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('compress.color')}
              </label>
              <select
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="no-change">{t('compress.noChange')}</option>
                <option value="grayscale">{t('compress.grayscale')}</option>
                <option value="monochrome">{t('compress.monochrome')}</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-gray-600">
              {t('compress.info')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

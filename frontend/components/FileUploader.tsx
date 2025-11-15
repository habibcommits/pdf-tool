import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import Loader from './Loader';

interface FileUploaderProps {
  endpoint: string;
  accept: { [key: string]: string[] };
  multiple?: boolean;
  title: string;
}

export default function FileUploader({ endpoint, accept, multiple = true, title }: FileUploaderProps) {
  const { t } = useTranslation('common');
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setDownloadUrl(null);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    
    if (multiple) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    } else {
      formData.append('file', files[0]);
    }

    try {
      const response = await axios.post(endpoint, formData, {
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{title}</h1>
      
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

      {files.length > 0 && !processing && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            {multiple ? t('upload.selectFiles') : 'Selected File'}:
          </h3>
          <ul className="bg-gray-100 rounded p-4">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-700">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
          
          <button
            onClick={handleUpload}
            disabled={processing}
            className="mt-4 w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Process
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
          <p className="text-green-800 font-semibold mb-4">Processing complete!</p>
          <a
            href={downloadUrl}
            download="processed.pdf"
            className="inline-flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <FiDownload />
            {t('upload.download')}
          </a>
        </div>
      )}
    </div>
  );
}

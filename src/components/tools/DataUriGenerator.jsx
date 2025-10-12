import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/tools/DataUriGenerator.css';

const DataUriGenerator = () => {
    const { t } = useTranslation('dataUriGenerator');
    const { theme } = useTheme();
    const [inputType, setInputType] = useState('text');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [textType, setTextType] = useState('plainText');
    const [dataUri, setDataUri] = useState('');
    const [fileInfo, setFileInfo] = useState(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    const mimeTypes = {
        plainText: 'text/plain',
        html: 'text/html',
        css: 'text/css',
        javascript: 'application/javascript',
        json: 'application/json',
        xml: 'application/xml',
        svg: 'image/svg+xml'
    };

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileInfo({
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                lastModified: selectedFile.lastModified
            });
        }
    };

    const generateDataUri = () => {
        try {
            if (inputType === 'text' && text.trim()) {
                const mimeType = mimeTypes[textType] || 'text/plain';
                const encodedText = encodeURIComponent(text);
                const uri = `data:${mimeType};charset=utf-8,${encodedText}`;
                setDataUri(uri);
                setFileInfo({
                    name: 'text.txt',
                    size: new Blob([text]).size,
                    type: mimeType,
                    characterCount: text.length,
                    uriLength: uri.length
                });
            } else if (inputType === 'file' && file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const uri = e.target.result;
                    setDataUri(uri);
                    setFileInfo(prev => ({
                        ...prev,
                        uriLength: uri.length
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please provide input text or select a file');
            }
            setCopied(false);
        } catch (error) {
            alert('Error generating Data URI: ' + error.message);
        }
    };

    const copyUri = () => {
        navigator.clipboard.writeText(dataUri);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setText('');
        setFile(null);
        setDataUri('');
        setFileInfo(null);
        setCopied(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getPreview = () => {
        if (!dataUri) return null;

        if (dataUri.startsWith('data:image/')) {
            return <img src={dataUri} alt="Preview" className="image-preview" />;
        } else if (dataUri.startsWith('data:text/') || dataUri.startsWith('data:application/')) {
            const content = decodeURIComponent(dataUri.split(',')[1]);
            return (
                <pre className="text-preview">
                    {content.length > 1000 ? content.substring(0, 1000) + '...' : content}
                </pre>
            );
        }
        return <div className="no-preview">No preview available</div>;
    };

    return (
        <div className={`data-uri-generator ${theme}`}>
            <div className="tool-header">
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </div>

            <div className="generator-container">
                <div className="input-section">
                    <div className="input-type-selector">
                        <label>
                            <input
                                type="radio"
                                value="text"
                                checked={inputType === 'text'}
                                onChange={(e) => setInputType(e.target.value)}
                            />
                            {t('textInput')}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="file"
                                checked={inputType === 'file'}
                                onChange={(e) => setInputType(e.target.value)}
                            />
                            {t('fileInput')}
                        </label>
                    </div>

                    {inputType === 'text' && (
                        <div className="text-input-section">
                            <div className="text-type-selector">
                                <label>{t('textType')}:</label>
                                <select value={textType} onChange={(e) => setTextType(e.target.value)}>
                                    <option value="plainText">{t('plainText')}</option>
                                    <option value="html">{t('html')}</option>
                                    <option value="css">{t('css')}</option>
                                    <option value="javascript">{t('javascript')}</option>
                                    <option value="json">{t('json')}</option>
                                    <option value="xml">{t('xml')}</option>
                                    <option value="svg">{t('svg')}</option>
                                </select>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t('textPlaceholder')}
                                rows="8"
                            />
                        </div>
                    )}

                    {inputType === 'file' && (
                        <div className="file-input-section">
                            <div className="file-selector">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="file-input"
                                />
                                <div className="file-info">
                                    {file ? (
                                        <div className="file-details">
                                            <strong>{file.name}</strong>
                                            <span>({formatFileSize(file.size)})</span>
                                        </div>
                                    ) : (
                                        <span className="no-file">{t('noFileSelected')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="action-buttons">
                    <button onClick={generateDataUri} className="primary-btn">
                        {t('generateUri')}
                    </button>
                    <button onClick={clearAll} className="secondary-btn">
                        {t('clear')}
                    </button>
                </div>

                {fileInfo && (
                    <div className="file-info-section">
                        <h3>{t('fileInfo')}</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">{t('fileName')}:</span>
                                <span className="info-value">{fileInfo.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">{t('fileSize')}:</span>
                                <span className="info-value">{formatFileSize(fileInfo.size)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">{t('mimeType')}:</span>
                                <span className="info-value">{fileInfo.type}</span>
                            </div>
                            {fileInfo.characterCount && (
                                <div className="info-item">
                                    <span className="info-label">{t('characterCount')}:</span>
                                    <span className="info-value">{fileInfo.characterCount.toLocaleString()}</span>
                                </div>
                            )}
                            {fileInfo.uriLength && (
                                <div className="info-item">
                                    <span className="info-label">{t('uriLength')}:</span>
                                    <span className="info-value">{fileInfo.uriLength.toLocaleString()} characters</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {dataUri && (
                    <div className="results-section">
                        <div className="data-uri-output">
                            <div className="output-header">
                                <h3>{t('dataUri')}</h3>
                                <button 
                                    onClick={copyUri}
                                    className={`copy-btn ${copied ? 'copied' : ''}`}
                                >
                                    {copied ? '✓' : t('copyUri')}
                                </button>
                            </div>
                            <textarea
                                value={dataUri}
                                readOnly
                                rows="4"
                                className="uri-output"
                            />
                            {copied && (
                                <div className="copied-message">
                                    {t('uriCopied')}
                                </div>
                            )}
                        </div>

                        <div className="preview-section">
                            <h3>{t('preview')}</h3>
                            <div className="preview-container">
                                {getPreview()}
                            </div>
                        </div>
                    </div>
                )}

                <div className="data-uri-info">
                    <h4>{t('dataUriInfo')}</h4>
                    <ul>
                        <li>{t('info1')}</li>
                        <li>{t('info2')}</li>
                        <li>{t('info3')}</li>
                        <li>{t('info4')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DataUriGenerator;
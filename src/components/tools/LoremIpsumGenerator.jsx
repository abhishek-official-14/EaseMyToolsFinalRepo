import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/tools/LoremIpsumGenerator.css';

const LoremIpsumGenerator = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [outputType, setOutputType] = useState('paragraphs');
    const [quantity, setQuantity] = useState(3);
    const [generatedText, setGeneratedText] = useState('');

    const loremIpsumWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
        'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
        'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna',
        'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis',
        'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
        'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis',
        'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate',
        'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat',
        'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
        'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa',
        'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const generateText = () => {
        let text = '';

        if (outputType === 'paragraphs') {
            for (let i = 0; i < quantity; i++) {
                text += generateParagraph() + '\n\n';
            }
        } else if (outputType === 'words') {
            text = generateWords(quantity);
        } else if (outputType === 'sentences') {
            for (let i = 0; i < quantity; i++) {
                text += generateSentence() + ' ';
            }
        } else if (outputType === 'list') {
            for (let i = 0; i < quantity; i++) {
                text += `• ${generateSentence()}\n`;
            }
        }

        setGeneratedText(text.trim());
    };

    const generateParagraph = () => {
        const sentences = 4 + Math.floor(Math.random() * 3); // 4-6 sentences
        let paragraph = '';
        
        for (let i = 0; i < sentences; i++) {
            paragraph += generateSentence() + ' ';
        }
        
        return paragraph.trim();
    };

    const generateSentence = () => {
        const words = 8 + Math.floor(Math.random() * 8); // 8-15 words
        let sentence = generateWords(words);
        
        // Capitalize first letter and add period
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
        
        return sentence;
    };

    const generateWords = (count) => {
        let words = '';
        
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * loremIpsumWords.length);
            words += loremIpsumWords[randomIndex] + ' ';
        }
        
        return words.trim();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedText);
        alert(t('loremIpsum', 'copied') || 'Text copied to clipboard!');
    };

    const clearText = () => {
        setGeneratedText('');
    };

    const downloadText = () => {
        const blob = new Blob([generatedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lorem-ipsum.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`lorem-generator ${theme}`}>
            <div className="generator-header">
                <h1>{t('loremIpsum', 'title') || 'Lorem Ipsum Generator'}</h1>
                <p>{t('loremIpsum', 'subtitle') || 'Generate placeholder text for your projects'}</p>
            </div>

            <div className="generator-container">
                <div className="controls-section">
                    <div className="control-group">
                        <label>{t('loremIpsum', 'outputType') || 'Output Type'}</label>
                        <select 
                            value={outputType} 
                            onChange={(e) => setOutputType(e.target.value)}
                            className="type-select"
                        >
                            <option value="paragraphs">{t('loremIpsum', 'paragraphs') || 'Paragraphs'}</option>
                            <option value="sentences">{t('loremIpsum', 'sentences') || 'Sentences'}</option>
                            <option value="words">{t('loremIpsum', 'words') || 'Words'}</option>
                            <option value="list">{t('loremIpsum', 'listItems') || 'List Items'}</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label>{t('loremIpsum', 'quantity') || 'Quantity'}</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={outputType === 'words' ? 1000 : 50}
                            className="quantity-input"
                        />
                    </div>

                    <button onClick={generateText} className="generate-btn">
                        {t('loremIpsum', 'generate') || 'Generate Lorem Ipsum'}
                    </button>
                </div>

                {generatedText && (
                    <div className="output-section">
                        <div className="output-header">
                            <h3>{t('loremIpsum', 'generatedText') || 'Generated Text'}</h3>
                            <div className="output-actions">
                                <button onClick={copyToClipboard} className="copy-btn">
                                    {t('loremIpsum', 'copy') || 'Copy'}
                                </button>
                                <button onClick={downloadText} className="download-btn">
                                    {t('loremIpsum', 'download') || 'Download'}
                                </button>
                                <button onClick={clearText} className="clear-btn">
                                    {t('loremIpsum', 'clear') || 'Clear'}
                                </button>
                            </div>
                        </div>
                        <div className="text-output">
                            <pre>{generatedText}</pre>
                        </div>
                    </div>
                )}

                <div className="info-section">
                    <h4>{t('loremIpsum', 'aboutLoremIpsum') || 'About Lorem Ipsum'}</h4>
                    <p>{t('loremIpsum', 'loremInfo') || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry\'s standard dummy text ever since the 1500s.'}</p>
                    
                    <h5>{t('loremIpsum', 'commonUses') || 'Common Uses:'}</h5>
                    <ul>
                        <li>{t('loremIpsum', 'use1') || 'Web design mockups'}</li>
                        <li>{t('loremIpsum', 'use2') || 'Printing and typesetting'}</li>
                        <li>{t('loremIpsum', 'use3') || 'Layout testing'}</li>
                        <li>{t('loremIpsum', 'use4') || 'Content placeholder'}</li>
                    </ul>

                    <div className="quick-generate">
                        <h5>{t('loremIpsum', 'quickGenerate') || 'Quick Generate:'}</h5>
                        <div className="quick-buttons">
                            <button onClick={() => {setOutputType('paragraphs'); setQuantity(1); generateText();}} className="quick-btn">
                                1 {t('loremIpsum', 'paragraph') || 'Paragraph'}
                            </button>
                            <button onClick={() => {setOutputType('paragraphs'); setQuantity(3); generateText();}} className="quick-btn">
                                3 {t('loremIpsum', 'paragraphs') || 'Paragraphs'}
                            </button>
                            <button onClick={() => {setOutputType('words'); setQuantity(50); generateText();}} className="quick-btn">
                                50 {t('loremIpsum', 'words') || 'Words'}
                            </button>
                            <button onClick={() => {setOutputType('list'); setQuantity(5); generateText();}} className="quick-btn">
                                5 {t('loremIpsum', 'listItems') || 'List Items'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoremIpsumGenerator;
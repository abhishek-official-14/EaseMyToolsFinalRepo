import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/tools/JSONFormatter.css';

const JSONFormatter = () => {
    const { t } = useTranslation(); // <-- i18next
    const { theme } = useTheme();
    const [inputJSON, setInputJSON] = useState('');
    const [formattedJSON, setFormattedJSON] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');

    const formatJSON = () => {
        try {
            if (!inputJSON.trim()) {
                setFormattedJSON('');
                setIsValid(true);
                setError('');
                return;
            }
            const parsed = JSON.parse(inputJSON);
            setFormattedJSON(JSON.stringify(parsed, null, 2));
            setIsValid(true);
            setError('');
        } catch (err) {
            setIsValid(false);
            setError(err.message);
            setFormattedJSON('');
        }
    };

    const minifyJSON = () => {
        try {
            if (!inputJSON.trim()) {
                setFormattedJSON('');
                setIsValid(true);
                setError('');
                return;
            }
            const parsed = JSON.parse(inputJSON);
            setFormattedJSON(JSON.stringify(parsed));
            setIsValid(true);
            setError('');
        } catch (err) {
            setIsValid(false);
            setError(err.message);
            setFormattedJSON('');
        }
    };

    const validateJSON = () => {
        try {
            if (!inputJSON.trim()) {
                setIsValid(true);
                setError('');
                return;
            }
            JSON.parse(inputJSON);
            setIsValid(true);
            setError(t('jsonFormatter:valid', 'Valid JSON!'));
        } catch (err) {
            setIsValid(false);
            setError(err.message);
        }
    };

    const clearAll = () => {
        setInputJSON('');
        setFormattedJSON('');
        setIsValid(true);
        setError('');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formattedJSON);
        alert(t('jsonFormatter:copied', 'JSON copied to clipboard!'));
    };

    return (
        <div className={`json-formatter ${theme}`}>
            <div className="formatter-header">
                <h1>{t('jsonFormatter:title', 'JSON Formatter')}</h1>
                <p>{t('jsonFormatter:subtitle', 'Format, validate, and minify JSON data')}</p>
            </div>

            <div className="formatter-container">
                <div className="input-section">
                    <label>{t('jsonFormatter:inputLabel', 'Input JSON')}</label>
                    <textarea
                        value={inputJSON}
                        onChange={(e) => setInputJSON(e.target.value)}
                        placeholder={t('jsonFormatter:inputPlaceholder', 'Paste your JSON here...')}
                        className={`json-input ${!isValid ? 'error' : ''}`}
                        // @ts-ignore
                        rows="8"
                    />
                </div>

                <div className="button-group">
                    <button onClick={formatJSON} className="format-btn">
                        {t('jsonFormatter:format', 'Format JSON')}
                    </button>
                    <button onClick={minifyJSON} className="minify-btn">
                        {t('jsonFormatter:minify', 'Minify JSON')}
                    </button>
                    <button onClick={validateJSON} className="validate-btn">
                        {t('jsonFormatter:validate', 'Validate JSON')}
                    </button>
                    <button onClick={clearAll} className="clear-btn">
                        {t('jsonFormatter:clear', 'Clear All')}
                    </button>
                </div>

                {error && (
                    <div className={`error-message ${isValid ? 'valid' : 'invalid'}`}>
                        {error}
                    </div>
                )}

                {formattedJSON && (
                    <div className="output-section">
                        <label>{t('jsonFormatter:outputLabel', 'Formatted JSON')}</label>
                        <pre className="json-output">{formattedJSON}</pre>
                        <button onClick={copyToClipboard} className="copy-btn">
                            {t('jsonFormatter:copy', 'Copy to Clipboard')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JSONFormatter;

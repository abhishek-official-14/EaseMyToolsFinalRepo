import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ToolsPage.css";
import { useTheme } from "../contexts/ThemeContext";
import { toolsByCategory } from "../data/toolsData";

const CategoryToolsPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true);
    }, [categoryId]);

    // If category doesn't exist, show error message
    if (!toolsByCategory[categoryId] || toolsByCategory[categoryId].length === 0) {
        return (
            <div className={`category-tools-page ${theme}`}>
                <div className="category-header">
                    <button className="back-button" onClick={() => navigate('/tools')}>
                        ← Back to Tools
                    </button>
                    <h1>Category Not Found</h1>
                    <p>The category "{categoryId}" doesn't exist or has no tools.</p>
                    <button
                        className="back-button"
                        onClick={() => navigate('/tools')}
                        style={{ marginTop: '1rem' }}
                    >
                        Go to Tools Page
                    </button>
                </div>
            </div>
        );
    }

    const categoryTools = toolsByCategory[categoryId];
    const getCategoryTitle = () => {
        const titles = {
            image: "Image Tools",
            converters: "Converters",
            text: "Text Tools",
            calculators: "Calculators",
            file: "File Tools",
            web: "Web Tools",
            generators: "Generators"
        };
        return titles[categoryId] || "Tools";
    };

    return (
        <div className={`category-tools-page ${theme}`}>
            <div className="category-header">
                <button className="back-button" onClick={() => navigate('/tools')}>
                    ← Back to Tools
                </button>
                <h1>{getCategoryTitle()}</h1>
                <p>{categoryTools.length} tools available</p>
            </div>

            <div className={`category-tools-grid ${animated ? 'animated' : ''}`}>
                {categoryTools.map((tool, index) => {
                    const IconComponent = tool.icon;
                    return (
                        <div
                            key={tool.name}
                            className={`category-tool-card ${theme} floating-card`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => navigate(tool.link)}
                        >
                            <div className="tool-card-content">
                                <IconComponent className="tool-card-icon" />
                                <h3>{tool.name}</h3>
                                <p>Click to use this tool</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryToolsPage;
import React, { useState } from 'react';

// Main App Component
const App = () => {
    // State for user inputs
    const [logoName, setLogoName] = useState('');
    const [keywords, setKeywords] = useState('');
    const [colors, setColors] = useState('');
    const [symbols, setSymbols] = useState('');
    // Enhanced default prompt prefix for better logo generation
    const [promptPrefix, setPromptPrefix] = useState('Abstract, minimalist, modern, professional, clean, iconic, vector logo design, brand identity, flat design, simple, crisp');

    // State for generated logos and loading status
    const [generatedLogos, setGeneratedLogos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // NEW STATE: For showing success message
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // State for current step in the multi-step form
    const [currentStep, setCurrentStep] = useState(1); // 1: Name, 2: Keywords, 3: Colors, 4: Symbols, 5: Style, 6: Generate/Results

    // Backend API URL (ensure this matches your Flask backend's URL)
    const API_BASE_URL = 'http://127.0.0.1:5000'; // Default Flask port

    // Function to construct the prompt for the AI
    const constructPrompt = (name, keys, cols, syms, prefix) => {
        let prompt = prefix; 
        if (name) prompt += `, for brand "${name}"`; 
        if (keys) prompt += `, concept: ${keys}`; 
        if (cols) prompt += `, color palette: ${cols}`; 
        if (syms) prompt += `, incorporating specific symbols: ${syms}`; 

        // --- EXTREMELY STRONG CHANGES FOR SINGLE LOGO PER IMAGE ---
        // Overwhelm with positive constraints for a single, central object
        prompt += `. ONLY ONE LOGO, SINGLE OBJECT, ISOLATED, CENTERED, STANDALONE.`; // Added "NO TEXT ON LOGO"
        // Aggressive negative prompts to suppress multiples and unwanted elements
        prompt += ` Avoid: multiple logos, text artifacts, words, typography, letters, fonts, symbols, busy backgrounds, gradients, shadows, 3D effects, collage, grid, watermark, multiple elements, variations, sheet.`; 
        // --- End of extremely strong changes ---

        return prompt;
    };

    // Function to call the backend API
    const generateLogos = async () => {
        setLoading(true);
        setError(null);
        setGeneratedLogos([]); // Clear previous logos
        setShowSuccessMessage(false); // Hide success message at start of new generation

        const currentPrompt = constructPrompt(logoName, keywords, colors, symbols, promptPrefix);

        try {
            // Frontend will request 4 images, making 4 sequential calls to the backend.
            // Backend is configured to generate 1 image per call for free tier reliability.
            const numImagesToRequest = 4; 
            const newGeneratedLogos = [];

            for (let i = 0; i < numImagesToRequest; i++) {
                const response = await fetch(`${API_BASE_URL}/generate_logo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: currentPrompt, num_images: 1 }), 
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate logo');
                }

                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    newGeneratedLogos.push(data.images[0]);
                    setGeneratedLogos([...newGeneratedLogos]); 
                }
                // Add a longer delay between requests to give Hugging Face API more breathing room
                await new Promise(resolve => setTimeout(resolve, 2000)); 
            }
            
            setCurrentStep(6); 
            setShowSuccessMessage(true); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle download of an image
    const handleDownload = (base64Image, index) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Image}`;
        link.download = `logocraft_logo_${index + 1}.png`; 
        document.body.appendChild(link);
        document.body.removeChild(link);
    };

    // Function to handle customization (pre-fill form)
    const handleCustomize = () => {
        setCurrentStep(1);
        setGeneratedLogos([]); 
        setShowSuccessMessage(false); 
        window.scrollTo(0, 0); 
    };

    // Define predefined styles for the prompt prefix
    const predefinedStyles = [
        { label: "Abstract & Minimalist", value: "Abstract, minimalist, modern, professional, clean, iconic, vector logo design, brand identity, flat design, simple, crisp" },
        { label: "Geometric & Symmetrical", value: "Geometric, symmetrical, precise, clean lines, strong shapes, professional, abstract, vector logo design" },
        { label: "Organic & Flowing", value: "Organic, flowing, natural, fluid, artistic, elegant, creative, hand-drawn style, vector logo design" },
        { label: "Bold & Vibrant", value: "Bold, vibrant, energetic, playful, eye-catching, modern, impactful, striking colors, vector logo design" },
        { label: "Luxury & Elegant", value: "Luxury, elegant, sophisticated, classic, refined, subtle, minimalist, emblem, intricate details, vector logo design" },
        { label: "Custom Style", value: "" } 
    ];

    // --- Standard CSS Class Names ---
    const inputClasses = "input-field"; 
    const buttonClasses = "button-base";
    const primaryButton = `${buttonClasses} button-primary`;
    const secondaryButton = `${buttonClasses} button-secondary`;
    const disabledButton = `${buttonClasses} button-disabled`;

    // Step navigation buttons
    const renderStepButtons = () => (
        <div className="flex justify-between mt-10 p-4 border-t border-gray-700"> 
            {currentStep > 1 && currentStep < 6 && (
                <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className={secondaryButton}
                >
                    ⬅️ Previous
                </button>
            )}
            {currentStep < 5 && ( 
                <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className={`${primaryButton} ${currentStep === 1 ? 'ml-auto' : ''}`} 
                    disabled={
                        (currentStep === 1 && !logoName.trim()) || 
                        (currentStep === 2 && !keywords.trim())    
                    }
                >
                    Next ➡️
                </button>
            )}
            {currentStep === 5 && ( 
                <button
                    onClick={generateLogos}
                    className={`${primaryButton} ml-auto`} 
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Logos ✨'}
                </button>
            )}
            {currentStep === 6 && ( 
                <button
                    onClick={handleCustomize} 
                    className={`${primaryButton} ml-auto`} 
                >
                    Generate New Logos 🔄
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen"> 
            <div className="app-container"> 
                <h1 className="app-title"> 
                    <h1>LogoCraft :Your AI Logo Generator <span className="purple-accent">✨</span></h1> 
                </h1>
                <p className="app-subtitle"> 
                    Craft unique brand identities with the power of AI.
                </p>

                {/* Step Indicator */}
                <div className="step-indicator-container">
                    {[1, 2, 3, 4, 5].map(step => (
                        <React.Fragment key={step}>
                            <div className={`step-circle ${currentStep >= step ? 'active' : ''}`}>
                                {step} 
                            </div>
                            {step < 5 && (
                                <div className={`step-connector ${currentStep > step ? 'active' : ''}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Input Forms (Conditional Rendering based on currentStep) */}
                {currentStep === 1 && (
                    <div className="input-section animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Brand Name</h2>
                        <div>
                            <label htmlFor="logoName" className="input-label">
                                Logo Name:
                            </label>
                            <input
                                type="text"
                                id="logoName"
                                className={inputClasses}
                                value={logoName}
                                onChange={(e) => setLogoName(e.target.value)}
                                placeholder="e.g., LogoCraft"
                            />
                        </div>
                        {renderStepButtons()}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="input-section animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Keywords</h2>
                        <div>
                            <label htmlFor="keywords" className="input-label">
                                Add Keywords:
                            </label>
                            <input
                                type="text"
                                id="keywords"
                                className={inputClasses}
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., creativity, design, innovation"
                            />
                        </div>
                        {renderStepButtons()}
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="input-section animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Colors</h2>
                        <div>
                            <label htmlFor="colors" className="input-label">
                                Add Colors:
                            </label>
                            <input
                                type="text"
                                id="colors"
                                className={inputClasses}
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                placeholder="e.g., vibrant blue, sleek silver, deep purple"
                            />
                        </div>
                        {renderStepButtons()}
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="input-section animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Symbols (Optional)</h2>
                        <div>
                            <label htmlFor="symbols" className="input-label">
                                Specify your Symbols:
                            </label>
                            <input
                                type="text"
                                id="symbols"
                                className={inputClasses}
                                value={symbols}
                                onChange={(e) => setSymbols(e.target.value)}
                                placeholder="e.g., abstract brush stroke, geometric shape"
                            />
                        </div>
                        {renderStepButtons()}
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="input-section animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4 text-center">Artistic Style</h2>
                        <div>
                            <label htmlFor="promptPrefix" className="input-label">
                                Choose or Define Style:
                            </label>
                            <select
                                id="styleSelect"
                                className={`${inputClasses} select-field`} 
                                value={promptPrefix}
                                onChange={(e) => setPromptPrefix(e.target.value)}
                            >
                                {predefinedStyles.map((style, index) => (
                                    <option key={index} value={style.value}>
                                        {style.label}
                                    </option>
                                ))}
                            </select>
                            {promptPrefix === "" && ( 
                                <input
                                    type="text"
                                    id="customPromptPrefix"
                                    className={`${inputClasses} mt-4`} 
                                    value={promptPrefix}
                                    onChange={(e) => setPromptPrefix(e.target.value)}
                                    placeholder="e.g., Minimalist, abstract, flat design"
                                />
                            )}
                        </div>
                        {renderStepButtons()}
                    </div>
                )}

                {/* Loading / Error / Results */}
                {loading && (
                    <div className="text-center text-purple-400 text-xl font-medium mt-12">
                        Generating your logos, please wait...
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mt-6"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mt-12 animate-fade-in">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                        {error.includes("AI model requires payment") || error.includes("overloaded") || error.includes("Too many requests") ? (
                            <p className="mt-2 text-sm">Please try again in a few moments, or adjust your prompt for simpler concepts.</p>
                        ) : null}
                    </div>
                )}

                {/* Success Message Display */}
                {showSuccessMessage && generatedLogos.length > 0 && (
                    <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-lg relative mt-6 mb-8 text-center animate-fade-in">
                        <strong className="font-bold">Success!</strong> Your logos have been successfully generated! 🎉
                    </div>
                )}

                {currentStep === 6 && generatedLogos.length > 0 && (
                    <div className="mt-12 animate-fade-in">
                        <h2 className="text-4xl font-bold text-center text-white mb-10">
                            Your Generated Logos:
                        </h2>
                        <div className="logo-grid">
                            {generatedLogos.map((logoBase64, index) => (
                                <div key={index} className="logo-card">
                                    <img
                                        src={`data:image/png;base64,${logoBase64}`}
                                        alt={`Generated Logo ${index + 1}`}
                                        className="logo-image"
                                    />
                                    <div className="flex space-x-4 w-full justify-center">
                                        <button
                                            onClick={() => handleDownload(logoBase64, index)}
                                            className={`${primaryButton} button-flex-center`}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            Download
                                        </button>
                                        <button
                                            onClick={handleCustomize}
                                            className={`${secondaryButton} button-flex-center`}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
                                            Generate New
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {renderStepButtons()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
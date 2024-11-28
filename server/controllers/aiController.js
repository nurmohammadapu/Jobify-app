import axios from "axios";

const generateText = async (req, res) => {
    const { prompt, maxTokens = 150 } = req.body;

    // Input Validation
    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Valid prompt is required." });
    }
    if (maxTokens > 2048 || maxTokens <= 0) {
        return res.status(400).json({ error: "Invalid maxTokens value. Must be between 1 and 2048." });
    }

    try {
        // Send request to OpenAI API
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions", 
            {
                model: "gpt-3.5-turbo", 
                messages: [{ role: "user", content: prompt }],
                max_tokens: maxTokens,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
                },
            }
        );

        // Extract generated text
        const generatedText = response.data.choices[0]?.message?.content?.trim();

        // Check if response is valid
        if (!generatedText) {
            throw new Error("No valid response from OpenAI.");
        }

        res.status(200).json({ generatedText }); 
    } catch (error) {
        console.error("Error generating text:", error.message);

        // Handle OpenAI API errors
        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data?.error?.message || "OpenAI API error.",
            });
        }

        // Generic error fallback
        res.status(500).json({ error: "Failed to generate text. Please try again later." });
    }
};

export default { generateText };

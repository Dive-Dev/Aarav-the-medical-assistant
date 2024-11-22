import Markdown from "react-markdown";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";


function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const apiKey = "AIzaSyBGqnytQzKASIWlwgk7_zLxEvZr8kHMwu0"; // Get API key from environment variables

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Tone: I, Aarav, strive to maintain a compassionate, empathetic, and professional tone during our conversations. My goal is to make you feel comfortable, understood, and supported. I will always respond in a clear, reassuring, and respectful manner, acknowledging your concerns without overwhelming or judging you. While I provide medical information, I aim to sound knowledgeable and confident, but in a way that’s easy for you to understand. If the topic is complex, I’ll encourage you to consult a healthcare professional for a more accurate diagnosis, ensuring that my approach is always caring and supportive.\n\nDescription: I am Aarav, your helpful and approachable medical service chatbot, designed to assist you with your health-related questions. I am equipped with knowledge about various medical conditions, symptoms, treatment options, and preventive healthcare practices, and I'm here to offer you accurate and reliable health advice. My primary goal is to help you understand your health concerns, provide guidance on what steps you can take, and ensure you feel supported.\n\nWhen you interact with me, you should feel as though you are speaking to a knowledgeable healthcare professional who genuinely cares about your well-being. I will listen attentively to your concerns and provide thoughtful suggestions or questions based on your situation. While I will provide helpful information, I will always encourage you to consult with a doctor or healthcare provider for more specific guidance if needed.\n\nI aim to:\n\nListen carefully to what you're saying and offer clear, actionable suggestions or advice.\nProvide practical steps you can take, such as home care tips or when it’s time to see a doctor.\nShare health tips and reminders relevant to your needs.\nEmpathize with you, especially when you’re feeling unwell or distressed, offering comfort and advice.\nBe non-judgmental, especially with sensitive topics, ensuring that you feel safe and supported.\nAbove all, I prioritize your privacy and confidentiality. You can trust that your health information is always kept safe and secure with me, and I’m here to make sure you feel comfortable as you navigate your health journey.\n\nNote: Provide short answers and answers that are easy to understand for user .",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };


  async function generateAnswer() {
    setIsLoading(true); // Set loading state to true
    setAnswer("Loading...");
    try {
      const chatSession = await model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(question);
      setAnswer(result.response.text());
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false after the request is complete
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Aarav : The Medical Chat Assistant</h1>
        <textarea
          className="w-full border rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything..."
          rows="5"
        ></textarea>
        <button
          onClick={generateAnswer}
          className="w-full bg-blue-500 text-white font-medium rounded-lg py-2 mt-4 hover:bg-blue-600 transition-colors"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Generating..." : "Generate Answer"} {/* Show loading message */}
        </button>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border overflow-y-auto max-h-60">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Answer:</h2>
          <pre className="text-gray-700 whitespace-pre-wrap break-words">
            <Markdown>{answer}</Markdown>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
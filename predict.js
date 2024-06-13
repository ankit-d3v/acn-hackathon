import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: "QqvH8wko3rpDwzqv00oGmI6BT4kQdRNXAFvBEBXT", // This is your trial API key
});

(async () => {
    const response = await cohere.generate({
        model: "command",
        prompt: "give me pension advise\n",
        maxTokens: 300,
        temperature: 0.9,
        k: 0,
        stopSequences: [],
        returnLikelihoods: "NONE"
    });
    console.log(`Prediction: ${response.generations[0].text}`);
})();
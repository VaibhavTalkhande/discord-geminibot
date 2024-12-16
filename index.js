const {Client,GatewayIntentBits,Partials} = require("discord.js")
const dotenv = require("dotenv");
dotenv.config();
const client1 = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});
const { GoogleGenerativeAI } = require("@google/generative-ai");

const token = process.env.token;
const API_KEY = process.env.API_KEY;
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
// Validate tokens
if (!token || !API_KEY) {
  console.error("Missing required environment variables. Check .env file.");
  process.exit(1);
}

// Initialize Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Initialize Google Discuss Service Client
const palmClient = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});


// Function to interact with PaLM API
async function generateRhymingResponse(promptMessage) {
  try {
    const result = await MODEL_NAME.generateContent(promptMessage);
    
    return result.response.text() || "Sorry, I couldn't come up with a response.";
  } catch (error) {
    console.error("Error generating response:", error.message);
    return "There was an error processing your request.";
  }
}

// const generateRespone = async () => {
//   const response = await generateRhymingResponse("what do you do");
//   console.log(response);
// }

// generateRespone();
// Set up Discord event listener
client1.on("ready", () => {
  console.log(`Logged in as ${client1.user.tag}!`);
});

client1.on("messageCreate", async (message) => {
  
  if (message.author.bot) return; // Ignore bot messages

  const promptMessage = message.content;

   console.log(`Received message: ${promptMessage}`);
   const response = await generateRhymingResponse(promptMessage);

  // Send the response back to Discord
   message.reply(response);
});

// Log in to Discord
client1.login(token).catch((err) => {
  console.error("Error logging into Discord:", err.message);
});

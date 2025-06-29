// pages/api/tts-proxy.js
// import fetch from 'node-fetch'; // Import node-fetch

// export default async function handler(req, res) {
//   const { textMessage } = req.query; // Get the textMessage from the query parameter
//   const encodedText = encodeURIComponent(textMessage);

//   // Prepare the external API request parameters
//   const lang = req.query?.lang || 'ar', // en = english , ar = arabic
//         engine = 'g3',
//         pitch = '0.5',
//         rate = '0.53', // 0.6 perfect for 'en'
//         volume = '0.9',
//         gender = 'male',
//         apiKey = 'MsWPQFPp'; // Your API key
//   console.log(lang);
//   const url = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodedText}&lang=${lang}&engine=${engine}&pitch=${pitch}&rate=${rate}&volume=${volume}&key=${apiKey}&gender=${gender}`;

//   try {
//     const externalApiResponse = await fetch(url);
    
//     if (!externalApiResponse.ok) {
//       throw new Error('Failed to fetch text-to-speech');
//     }

//     // Buffer the response
//     const buffer = await externalApiResponse.buffer();
    
//     // Set headers for the audio file
//     res.setHeader('Content-Type', 'audio/mpeg');
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust as needed for production

//     // Send the audio buffer to the client
//     res.status(200).send(buffer);
//   } catch (error) {
//     console.error('Error in tts-proxy:', error);
//     res.status(500).json({ error: error.message });
//   }
// }

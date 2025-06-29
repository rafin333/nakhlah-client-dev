// pages/api/textToSpeech.js

// export default async function handler(req, res) {
//     const { text, lang = 'ar', engine = 'g3', pitch = '0.45', rate = '0.5', volume = '1', gender = 'male' } = req.query;
//     console.log(lang); 
//     try {
//       const apiUrl = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(text)}&lang=${lang}&engine=${engine}&pitch=${pitch}&rate=${rate}&volume=${volume}&key=MsWPQFPp&gender=${gender}`;
//       console.log(apiUrl);
//       const apiResponse = await fetch(apiUrl);
//       console.log(apiResponse); 
//       const apiResponseData = await apiResponse.blob(); 
  
//       res.setHeader('Content-Type', 'audio/mpeg'); 
//       apiResponseData.stream().pipe(res);
//     } catch (error) {
//       console.error('Error fetching text-to-speech:', error);
//       res.status(500).json({ error: 'Failed to fetch text-to-speech' });
//     }
//   }
  
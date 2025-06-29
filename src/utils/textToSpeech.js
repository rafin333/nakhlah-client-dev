/* export const TextToSpeech = (textMessage) => {
    console.log(window.responsiveVoice); 
    const isResponsiveVoiceLoaded = window.localStorage.getItem("RV");
    console.log(isResponsiveVoiceLoaded);
    if (isResponsiveVoiceLoaded && window.responsiveVoice) {
        window.responsiveVoice.speak(textMessage, "Arabic Male", { pitch: .9 }, { rate: .5 });
        console.log('speak');
    } else {
        console.log("ResponsiveVoice not loaded yet.")
    }
} */
// Using the proxy API route instead of calling the external API directly
/* export const TextToSpeech = async (textMessage) => {
    console.log(`called`);
    try {
        console.log(textMessage)
        const lang = 'ar', engine = 'g3', pitch = '0.9', rate = '0.5', volume = '1', gender = 'male';

        const response = await fetch(`https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(textMessage)}&lang=${lang}&engine=${engine}&pitch=${pitch}&rate=${rate}&volume=${volume}&key=MsWPQFPp&gender=${gender}`);
        console.log(response);
        if (!response.ok) {
            throw new Error('Failed to fetch text-to-speech');
        }
        // Assuming you want to play the audio directly, for example:
        const blob = await response.blob();
        console.log(blob);
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        console.log(audio);
        audio.play();
    } catch (error) {
        console.error('Error using text-to-speech:', error);
    }
} */
/* export const TextToSpeech = (textMessage) => {
    console.log(window.responsiveVoice); 
    const isResponsiveVoiceLoaded = window.localStorage.getItem("RV");
    console.log(isResponsiveVoiceLoaded);
    if (isResponsiveVoiceLoaded && window.responsiveVoice) {
        const textToSynthesize = encodeURIComponent(textMessage);
        const language = 'ar';
        const pitch = '0.45';
        const rate = '0.5';
        const volume = '1';
        const apiKey = 'MsWPQFPp'; // Make sure to use your actual API key here
        const gender = 'male';
        const url = `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${textToSynthesize}&lang=${language}&engine=g3&name=&pitch=${pitch}&rate=${rate}&volume=${volume}&key=${apiKey}&gender=${gender}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Do something with the data returned from the API
                console.log(data);
                console.log('speak');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.log("ResponsiveVoice not loaded yet.")
    }
} */
export const TextToSpeech = async (textMessage, language="Arabic") => {
    let lang = language === "Arabic" ? 'ar' : 'en';
    // try {
      // Call the local proxy API endpoint instead of the external API
    //   const response = await fetch(`/api/tts-proxy?textMessage=${encodeURIComponent(textMessage)}&lang=${lang}`);
    //   const response = textMessage;
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch text-to-speech');
    //   }
      // Assuming you want to play the audio directly, for example:
    //   const blob = await response.blob();
    //   const audioUrl = URL.createObjectURL(textMessage);
      const audio = new Audio(textMessage);
      audio.play();
    // } catch (error) {
    //   console.error('Error using text-to-speech:', error);
    // }
  };

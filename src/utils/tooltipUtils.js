export const addTooltipsToTitle = (title, tooltips) => {
  if (!tooltips) return title;

  // Regular expression to split by words, including punctuation
  const words = title.split(/(\s+|[\u0600-\u06FF\p{M}]+)/u);

  // Regular expression to remove punctuation marks (including Arabic-specific ones)
  const removePunctuation = (word) => word.replace(/[\u061F.,\/#!$%\^&\*;:{}=\-_`~()؟؟]/g, '');

  // Loop through each word in the title
  const modifiedTitle = words
    .map(word => {
      // Trim the word to remove extra spaces around it
      const trimmedWord = word.trim();

      // Remove punctuation marks from the word to match with tooltips key
      const cleanedWord = removePunctuation(trimmedWord);

      // Find the tooltip for the current cleaned word
      const tooltipText = tooltips[cleanedWord];
      
      // If a tooltip is found, wrap the word in a span with the title attribute
      if (tooltipText) {
        return word.replace(
          cleanedWord,
          `<span data-title="${tooltipText}" class="tooltipsSpan tooltipsBox">  ${cleanedWord} </span>`
        );
      }

      // Return the word unchanged if no tooltip is found
      return word;
    })
    .join(''); // Join the words back into a string without adding extra spaces

  return modifiedTitle;
};

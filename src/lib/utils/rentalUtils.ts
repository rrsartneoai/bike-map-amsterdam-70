
/**
 * Returns the appropriate website URL for a given bike rental operator
 */
export const getRentalWebsiteUrl = (operator?: string): string => {
  if (!operator) return "https://example.com";
  
  // Normalize the operator name for case-insensitive comparison
  const normalizedOperator = operator.toLowerCase();
  
  if (normalizedOperator.includes('ov-fiets') || normalizedOperator.includes('ovfiets') || normalizedOperator.includes('ns')) {
    return "https://www.ns.nl/en/door-to-door/ov-fiets";
  }
  
  if (normalizedOperator.includes('macbike')) {
    return "https://www.macbike.nl/en/";
  }
  
  if (normalizedOperator.includes('yellow') && normalizedOperator.includes('bike')) {
    return "https://www.yellowbike.nl/en/";
  }
  
  if (normalizedOperator.includes('swapfiets')) {
    return "https://swapfiets.com/";
  }
  
  if (normalizedOperator.includes('a-bike')) {
    return "https://www.a-bike.eu/";
  }
  
  if (normalizedOperator.includes('green') && (normalizedOperator.includes('wheels') || normalizedOperator.includes('budget'))) {
    return "https://greenwheels.com/nl/en";
  }
  
  if (normalizedOperator.includes('b&s') || normalizedOperator.includes('bike & scooter')) {
    return "https://bikescootercity.com/";
  }
  
  // For unknown operators, return a search URL
  return `https://www.google.com/search?q=${encodeURIComponent(`${operator} bike rental amsterdam`)}`;
};

/**
 * Returns the domain name from a URL for display purposes
 */
export const getDomainFromUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch (error) {
    return url;
  }
};

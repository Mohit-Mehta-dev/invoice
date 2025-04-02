const fetchImageAsBlob = async (imageUrl: string): Promise<string> => {
    console.log('url:', imageUrl)
    const response = await fetch(imageUrl);
    const buffer = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(buffer); // Convert image to base64
    });
  };

export {fetchImageAsBlob}; 
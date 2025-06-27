 export const stripHtmlTags =(htmlString: string) => {
  if (!htmlString) {
    return ''; 
  }
 
  return htmlString.replace(/<[^>]*>/g, '');
}
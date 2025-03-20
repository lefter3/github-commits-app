// export function getPageNumberFromRel(relString: string, relType: string) {
//     const regex = new RegExp(`<https://api.github.com/repositories/\\d+/issues\\?page=(\\d+)>; rel="${relType}"`);
//     const match = relString.match(regex);
//     return match ? parseInt(match[1], 10) : null;
//   }
  export function getPageNumberFromRel(linkHeader: string, rel: string): number {
    if (!linkHeader) 1;
  
    // const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    // return linkHeader.match(nextPattern)[0] ?? 1;
    const regex = new RegExp(`<([^>]+)>;\\s*rel="${rel}"`);
    const match = linkHeader.match(regex);
    if (match) {
      const url = new URL(match[1]);
      return parseInt(url.searchParams.get('page') || '1', 10);
    }
  
    return 1;
  }
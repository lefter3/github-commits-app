  export function getPageNumberFromRel(linkHeader: string, rel: string): number {
    if (!linkHeader) 1;
    const regex = new RegExp(`<([^>]+)>;\\s*rel="${rel}"`);
    const match = linkHeader.match(regex);
    if (match) {
      const url = new URL(match[1]);
      return parseInt(url.searchParams.get('page') || '1', 10);
    }
  
    return 1;
  }
  export function groupBy(array: any, property: string) {
    return array.reduce((acc: any, obj: any) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  
  export function prepareDatasets(data: any): any[]{
    const groupByRepo = groupBy(data, 'repo')
    console.log('groupbyrepo', groupByRepo)
    const datasets: any[] = []
    Object.keys(groupByRepo).map((repoName)=>{
        datasets.push({
          label: repoName,
          data: groupByRepo[repoName].map((obj: any) => { return {
            date: obj.commitsDate,
            commits: obj.count
        }}),
            });
      })
    return datasets
  }
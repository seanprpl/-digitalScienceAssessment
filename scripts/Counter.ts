import * as fs from 'fs';
import * as Papa from 'papaparse';
import * as path from 'path';
import * as mostCommonWords from 'most-common-words-by-language';

interface CovidDimensionRow {
  'Date added' : string;
  'Trial ID' : string;
  Title : string; // 4 topical landscape
  'Brief title' : string; // shorter than title
  Acronym : string; 
  Abstract : string;
  'Publication date' : string;
  'Active years' : string;
  Phase : string;
  Conditions : string;
  Intervention : string;
  Gender : string;
  Registry : string;
  'Investigators/Contacts' : string; // 3. investigators
  'Sponsors/Collaborators' : string; // 8 collaborators
  'GRID IDs' : string;
  'Country of Sponsor/Collaborator' : string;
  'Collaborating Funders' : string; // 9 most research produced
  'Funder Country' : string;
  'Source Linkout' : string;
  'Dimensions URL' : string;
}


export default class Counter {
  private parsedData: any[];
  static dataFolder = path.join(__dirname, '..', 'src', 'data');

  constructor() {
    this.buildConfig();
  }

  // parse and then pass a callback to act on the parsed data
  // the main callback is buildFinalOutput
  public async parse(specificFileName: string) {
    let fullFilePath = path.join(Counter.dataFolder, 'raw', specificFileName);
    const hasExtension = /$.csv/.test(fullFilePath);
    if (!hasExtension) {
      fullFilePath += '.csv';
    }

    const fileString = fs.readFileSync(fullFilePath, 'utf8');
    Papa.parse(fileString, { ...this.buildConfig() });
  }

  private buildConfig = (): Papa.ParseConfig => ({
    header: true,
    skipEmptyLines: 'greedy' as 'greedy',
    // preview: 4,
    complete: parsedInfo => this.buildFinalOutput(parsedInfo)
  })

  protected buildFinalOutput(parsedInfo: Papa.ParseResult<any>) {
    const { data: rowData, errors } = parsedInfo;
    if (errors.length) {
      console.log(`errors:`, errors);
    }

    if (rowData) {
      const topics = this.countTopics(rowData);
      // const authors = this.countAuthors(rowData);
      const sponsors = this.countSponsors(rowData);
      // const funders = this.countFunders(rowData); // no data
      const publications = this.countPublications(rowData);
      const countries = this.countCountries(rowData);
      // console.log(`sponsors`, sponsors);

      const preparedData = JSON.stringify({ topics, sponsorsCollaborators: sponsors, publications, countries }, null, 2);
      // const preparedData = JSON.stringify({ topics, authors, sponsors, funders, countries });
      
      const formattedDataFolder = path.join(Counter.dataFolder, 'formatted');
      const fileName = 'output.json';
      const fullFilePath = path.join(formattedDataFolder, fileName);
      fs.writeFileSync(fullFilePath, preparedData);
    }
  }

  protected countTopics (rowData: CovidDimensionRow[]) {   
    // count words
    let wordListCounts = {};
    rowData.forEach((row: CovidDimensionRow) => {
      const { Title } = row;
      
      const first10KEnglishWords = mostCommonWords.getWordsList('english'); // 10k words is the limit
      
      ['randomized', 'efficacy', 'observational', 'cohort', 'randomised', 'placebo', 'severity', 'critically', 'investigating']
        .forEach(undesiredWord => first10KEnglishWords.push(undesiredWord));

      const titleWords = Title.split(" ");
      titleWords.forEach(word => {
        // remove punctuation
        const cleanedWord = word
          .replace(/\W/g, "")
          .toLowerCase();
        const isCommon = first10KEnglishWords.indexOf(cleanedWord) > -1;
        const notANumber = Number.isNaN(Number(cleanedWord));
        if (isCommon === false && notANumber) {
          if (!wordListCounts[cleanedWord]) {
            wordListCounts[cleanedWord] = 1;
          } else {
            wordListCounts[cleanedWord] += 1;
          }
        }
      });
    });
    
    const top100 = Object.entries(wordListCounts).sort((a, b) => {
      //console.log(`a`, a);
      return (b[1] as number) - (a[1] as number);
    })
      .filter((_, index) => index < 100);
    
    const finalObject = {}
    top100.forEach(arr => finalObject[arr[0]] = arr[1]);

    return finalObject;
  }

  protected countSponsors(rowData: CovidDimensionRow[]) {
    const sponsorCounts = this.countExact(rowData, 'Sponsors/Collaborators');
    const top5 = Object.entries(sponsorCounts).sort((a, b) => {
      // console.log(`a`, a);
      return (b[1] as number) - (a[1] as number);
    })
      .filter((_, index) => index < 5);
    
    const finalObject = {}
    top5.forEach(arr => finalObject[arr[0]] = arr[1]);  

    return finalObject;
  } 

  /*
    empty strings
  */
  protected countFunders(rowData: CovidDimensionRow[]) {
    const funderCounts = this.countExact(rowData, 'Collaborating Funders');
    console.log(`rowData`, rowData);
    const top5 = Object.entries(funderCounts).sort((a, b) => {
      //console.log(`a`, a);
      return (b[1] as number) - (a[1] as number);
    })
      .filter((_, index) => index < 5);
    
    return top5;
  } 

  protected countPublications(rowData: CovidDimensionRow[]) {
    const registryCounts = this.countExact(rowData, 'Registry');
    //console.log(`rowData`, rowData);
    const top5 = Object.entries(registryCounts).sort((a, b) => {
      //console.log(`a`, a);
      return (b[1] as number) - (a[1] as number);
    })
      .filter((_, index) => index < 5);
    
    const finalObject = {}
    top5.forEach(arr => finalObject[arr[0]] = arr[1]);
    return finalObject;
  } 

  protected countCountries(rowData: CovidDimensionRow[]) {
    const countryCounts = this.countExact(rowData, 'Country of Sponsor/Collaborator');
    //console.log(`rowData`, rowData);
    const top5 = Object.entries(countryCounts).sort((a, b) => {
      // console.log(`a`, a);
      return (b[1] as number) - (a[1] as number);
    })
      .filter((_, index) => index < 5);
    
    const finalObject = {}
    top5.forEach(arr => finalObject[arr[0]] = arr[1]);
    return finalObject;
  } 

  private countExact(rowData, column): {} {
    const counts = {}
    rowData.forEach((row: CovidDimensionRow) => {
      let cellValue: string = row[column];
      let splitValues: string[] = cellValue.split(/;\s?/);

      splitValues?.forEach(value => {
        if (!counts[value]) {
          counts[value] = 1;
        } else {
          counts[value] += 1;
        }
      });
    });

    return counts;
  }

}




// ------------------------ execution
const counter = new Counter();
counter.parse('1');


// 


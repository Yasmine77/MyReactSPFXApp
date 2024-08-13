
export interface Column {
  id: keyof RowData;
  label: string;
}

  
  export interface RowData {
    id: number;
    Title: string;
    StartYear: string;
    EndYear: string;
    Budget: string;
    Status: string;
    Approved: string;
    Type:string;
    countryImplementation?:string
    donorsNames?:string
  }



  
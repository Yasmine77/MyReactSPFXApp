export interface RowData {
    //selected: string;
    id: number;
    Title: string;
    //type: string;
    //implementationStatus: string;
    //regionalDialogue: string;
    StartYear: string;
    EndYear: string;
    //contact: string;
    //databaseStatus: string;
    Budget: number;
    //iat: string;
    Status: string;
    InitiativeType:string;
    status?: string;  
    color?: string;
    Approved?: string;   
    countryImplementation:string;
    donorsNames:string;
  }
  export interface RowDataFunding {
    id?:number;
    ProjectReferenceID: number;
    FundingPartnerCompany: string;
    FundingPartnerName: string;
    FundingShare: string;
  
  }

  export interface RowDataImplOrg { 
    id?:number;
    ProjectReferenceID: number;
    Category: string;
    ImplementingOrganisation: string;
    Other: string;
  }

  export interface RowDataCountryImp {
    id?:number;
    ProjectReferenceID: number;
    Title: string;
  }  
  export interface RowDataJVAP {
    id?:number;
    ProjectReferenceID: number;
    JVAPDomains: string;
    JVAPPriorities: string;
  } 
  export interface Column {
    id: keyof RowData;
    label: string;
  }
  
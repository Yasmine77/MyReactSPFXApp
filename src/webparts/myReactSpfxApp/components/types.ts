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
   // CountryImplimentation:string;
  }
  export interface RowDataFunding {
    ProjectReferenceID: number;
    FundingPartnerCompany: string;
    FundingPartnerName: string;
    FundingShare: string;
  
  }

  export interface RowDataImplOrg { 
    ProjectReferenceID: number;
    Category: string;
    ImplementingOrganisation: string;
    Other: string;
  }

  export interface RowDataCountryImp {
    ProjectReferenceID: number;
    Title: string;
  }  
  export interface RowDataJVAP {
    ProjectReferenceID: number;
    JVAPDomains: string;
    JVAPPriorities: string;
  } 
  export interface Column {
    id: keyof RowData;
    label: string;
  }
  
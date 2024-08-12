
interface IListConfig {
    name: string;
    columns: string[];
  }
  
  const LIST_CONFIG: Record<string, IListConfig> = {
    PROJECT_TYPE: {
      name: "ProjectType",
      columns: ["Id", "Title"], 
    },
    POLICY_TYPE: {
      name: "InitiativeType",
      columns: ["Id", "Title"], 
    },
    COUNTRY: {
      name: "Country",
      columns: ["Id", "Title"], 
    },

   INSTITUTION_TYPES: {
      name: "InstitutionTypes",
      columns: ["Id", "Title"], 
    },
    COUNTRY_TYPES: {
      name: "CountryType",
      columns: ["Id", "Title"], 
    },
    IMPLEMENTATION_ORGANISATION_TYPES: {
      name: "ImplementingOrganisationList",
      columns: ["Id", "Title"], 
    },
    JVAP_DOMAINS: {
      name: "Domain",
      columns: ["Id", "DomainName"], 
    },
    JVAP_PRIORITIES: {
      name: "Priority",
      columns: ["Id", "Priority"], 
    },
  };
  
  export default LIST_CONFIG;
  
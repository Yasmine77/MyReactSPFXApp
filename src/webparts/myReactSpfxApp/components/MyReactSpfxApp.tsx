import * as React from 'react';
import { useState } from 'react';
import styles from './MyReactSpfxApp.module.scss';
import type { IMyReactSpfxAppProps } from './IMyReactSpfxAppProps';
import CustomTable from './CustomTable'; 
import { RowData, Column } from './types'; 
import ContactCard from './contactCard'; 

const columns: Column[] = [
  { id: 'Title', label: 'Title' },
  { id: 'StartYear', label: 'Start Year' },
  { id: 'EndYear', label: 'End Year' },
  { id: 'Budget', label: 'Total Budget' },
  { id: 'Status', label: 'Status' },
  
  { id: 'InitiativeType', label: 'InitiativeType' },
  { id: 'Approved', label: 'Approved' },
  { id: 'countryImplementation', label: 'Country(i)es Implementation' },
  { id: 'donorsNames', label: 'Donor(s)' },
];


const initialData: RowData[] = [
  { id: 0, Title: '', StartYear: '', EndYear: '', Budget: 0, Status: '', InitiativeType:'', countryImplementation:'',donorsNames:''},
];

const MyReactSpfxApp: React.FC<IMyReactSpfxAppProps> = ({ 
  description, 
  isDarkTheme, 
  environmentMessage, 
  hasTeamsContext, 
  userDisplayName
}) => {
  const [data, setData] = useState<RowData[]>(initialData);
  const [contact, setContact] = useState({
    image: '',
    name: userDisplayName,
    telephone: '123-456-7890',
    email: 'yasmine.mejri@consultim-it.com',
    department: 'IT Department',
    institution: 'ABC Institution',
  });

  const handleContactChange = (updatedContact: typeof contact) => {
    setContact(updatedContact);
  };

  return (
    <section className={styles.myReactSpfxApp}>
      <div className={styles.contactCardContainer}>
        <ContactCard contact={contact} onContactChange={handleContactChange} />
      </div>
      <div className={styles.customTableContainer}>
        <CustomTable
          columns={columns}
          data={data}
          setData={setData}
        />
      </div>
    </section>
  );
};

export default MyReactSpfxApp;

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
];

const initialData: RowData[] = [
  { id: 1, Title: 'Project A', StartYear: '2020', EndYear: '2023', Budget: 1, Status: 'In Progress', InitiativeType:'' },
  { id: 2, Title: 'Project B', StartYear: '2019', EndYear: '2021', Budget: 500, Status: 'Finished', InitiativeType:'' },
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

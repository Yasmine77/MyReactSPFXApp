import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SubCustomTable from './subCustomTable'; 
import ProjectCard from './ProjectCard';
import { createItem ,getRelatedTabByProject} from '../../services/sharepointService';
import { RowDataImplOrg, RowDataCountryImp, RowDataFunding, RowDataJVAP } from './types';
interface Column {
  id: string;
  label: string;
}

interface RowData {
  id?: number;
  [key: string]: any; 
}

/*const projectData = {
  id: '',
  title: '',
  type: '',
  implementationStatus: '',
  regionalStatus: '',
  regionalDialogue: '',
  startYear: '',
  endYear: '',
  contact: '',
  databaseStatus: '',
  totalBudget: '',
  iat: '',
  status: '',
  approved:''
};*/

interface ProjectFormProps {
  project: any; 
  mode: 'edit' | 'new'; 
  initiativeType: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initiativeType,project,mode }) => {
  const [data1, setData1] = useState<RowDataCountryImp[]>([]);
  const [data2, setData2] = useState<RowDataImplOrg[]>([]);
  const [data3, setData3] = useState<RowDataFunding[]>([]);
  const [data4, setData4] = useState<RowDataJVAP[]>([]);

  const [columns1, setColumns1] = useState<Column[]>([]);
  const [columns2, setColumns2] = useState<Column[]>([]);
  const [columns3, setColumns3] = useState<Column[]>([]);
  const [columns4, setColumns4] = useState<Column[]>([]);
  const [tablesVisible, setTablesVisible] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
 console.log(mode)
  const handleSaveProject = (saved: boolean) => {
    setTablesVisible(saved);
  };

 useEffect(() => {
  setIsVisible(initiativeType === 'Project');
}, [initiativeType]);
console.log(initiativeType)
  const [currentItemId, setCurrentItemId] = useState<number>(0);

  useEffect(() => {
    const fetchColumnData = () => {
      setColumns1([
        { id: 'Title', label: 'Countr(y)ies of implementation*' },
      ]);

      setColumns2([
        { id: 'Category', label: 'Category of Implementing Organisation*' },
        { id: 'ImplementingOrganisation', label: 'Implementing Organisation*' },
        { id: 'Other', label: 'Other Implementing Organisation*' },
      ]);

      setColumns3([
        { id: 'FundingPartnerCompany', label: 'Funding Partner Company' },
        { id: 'FundingPartnerName', label: 'Funding Partner Name' },
        { id: 'FundingShare', label: 'Funding Share' },
      ]);

      setColumns4([
        { id: 'JVAPDomains', label: 'JVAP Domains*' },
        { id: 'JVAPPriorities', label: 'JVAP Priorities*' },
      ]);
    };

    fetchColumnData();
  }, []);

  useEffect(() => {
    const id = Number(sessionStorage.getItem('createdItemId'));
    setCurrentItemId(id);
    console.log('Current Item ID:', id); 
  }, []);

  const handleAddRowCountryImp = () => {
    const newRow: RowDataCountryImp = {
      ProjectReferenceID: currentItemId,
      Title: '', 
    };
    setData1([...data1, newRow]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data1 = await getRelatedTabByProject('CountryImplementation');
        setData1(data1);
        console.log(data1)

        const data2 = await getRelatedTabByProject('ImplementationOrganisation');
        setData2(data2);
        console.log(data2)

        const data3 = await getRelatedTabByProject('Funding');
        setData3(data3);
        console.log(data3)

        const data4 = await getRelatedTabByProject('Domains');
        setData4(data4);
        console.log(data4)

      } catch (error) {
        console.error('Error fetching data for tabs:', error);
      }
    };

    fetchData();
  }, []);
  const handleAddRowImplOrg = () => {
    const newRow: RowDataImplOrg = {
      ProjectReferenceID: currentItemId,
      ImplementingOrganisation: '',
      Category: '', 
      Other: '', 
    };
    setData2([...data2, newRow]);
  };

  const handleAddRowFunding = () => {
    const newRow: RowDataFunding = {
      ProjectReferenceID: currentItemId,
      FundingPartnerCompany: '',
      FundingPartnerName: '',
      FundingShare: '',
    };
    setData3([...data3, newRow]);
  };

  const handleAddRowJVPA = () => {
    const newRow: RowDataJVAP = {
      ProjectReferenceID: currentItemId,
      JVAPDomains: '',
      JVAPPriorities: '',
    };
    setData4([...data4, newRow]);
  };

  const handleEditRow = async (updatedRow: RowData) => {
    if ('Title' in updatedRow) {
      setData1(data1.map(row => row.ProjectReferenceID === updatedRow.ProjectReferenceID ? updatedRow as RowDataCountryImp : row));
    } else if ('FundingPartnerCompany' in updatedRow) {
      setData3(data3.map(row => row.ProjectReferenceID === updatedRow.ProjectReferenceID ? updatedRow as RowDataFunding : row));
    } else if ('Category' in updatedRow) {
      setData2(data2.map(row => row.ProjectReferenceID === updatedRow.ProjectReferenceID ? updatedRow as RowDataImplOrg : row));
    } else if ('JVAPDomains' in updatedRow) {
      setData4(data4.map(row => row.ProjectReferenceID === updatedRow.ProjectReferenceID ? updatedRow as RowDataJVAP : row));
    }
    await saveRowToSharePoint(updatedRow);
  };

  const handleDeleteRow = (setData: React.Dispatch<React.SetStateAction<RowData[]>>, data: RowData[]) => {
    if (data.length > 0) {
      setData(data.slice(0, -1)); // Example: Remove the last row
    }
  };

  const saveRowToSharePoint = async (row: RowData) => {
    try {
      if ('Title' in row) {
        await createItem('CountryImplementation', row);
      } else if ('FundingPartnerCompany' in row) {
        await createItem('Funding', row);
      } else if ('Category' in row) {
        await createItem('ImplementationOrganisation', row);
      } else if ('JVAPDomains' in row) {
        await createItem('Domains', row);
      }
    } catch (error) {
      console.error('Error saving row:', error);
    }
  };

  return (
    <Box>
  <ProjectCard initiativeType={initiativeType} project={project} onSave={handleSaveProject} mode={mode} />
 
  <>
  {/* Render tables for 'edit' mode */}
  {mode === 'edit' && initiativeType && (
    <>
      <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
        <SubCustomTable
          columns={columns1}
          data={data1}
          onAdd={handleAddRowCountryImp}
          onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
          onDelete={() => handleDeleteRow(setData1, data1)}
          headerColor='#d8efd8'
          saveRow={saveRowToSharePoint}
          ButtonTitle='Country implementation'
        />
      </Box>

      {isVisible && (
        <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
          <SubCustomTable
            columns={columns2}
            data={data2}
            onAdd={handleAddRowImplOrg}
            onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
            onDelete={() => handleDeleteRow(setData2, data2)}
            headerColor='#faf0f2'
            saveRow={saveRowToSharePoint}
            ButtonTitle='Organisation'
          />
        </Box>
      )}

      <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
        <SubCustomTable
          columns={columns4}
          data={data4}
          onAdd={handleAddRowJVPA}
          onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
          onDelete={() => handleDeleteRow(setData4, data4)}
          headerColor='#fae5d4'
          saveRow={saveRowToSharePoint}
          ButtonTitle='JVAP'
        />
      </Box>

      {isVisible && (
        <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
          <SubCustomTable
            columns={columns3}
            data={data3}
            onAdd={handleAddRowFunding}
            onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
            onDelete={() => handleDeleteRow(setData3, data3)}
            headerColor='#efedb6'
            saveRow={saveRowToSharePoint}
            ButtonTitle='Funding'
          />
        </Box>
      )}
    </>
  )}

  {/* Render tables for 'new' mode */}
  {mode === 'new' && tablesVisible && initiativeType && (
    <>
      <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
        <SubCustomTable
          columns={columns1}
          data={data1}
          onAdd={handleAddRowCountryImp}
          onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
          onDelete={() => handleDeleteRow(setData1, data1)}
          headerColor='#d8efd8'
          saveRow={saveRowToSharePoint}
          ButtonTitle='Country implementation'
        />
      </Box>

      {isVisible && (
        <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
          <SubCustomTable
            columns={columns2}
            data={data2}
            onAdd={handleAddRowImplOrg}
            onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
            onDelete={() => handleDeleteRow(setData2, data2)}
            headerColor='#faf0f2'
            saveRow={saveRowToSharePoint}
            ButtonTitle='Organisation'
          />
        </Box>
      )}

      <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
        <SubCustomTable
          columns={columns4}
          data={data4}
          onAdd={handleAddRowJVPA}
          onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
          onDelete={() => handleDeleteRow(setData4, data4)}
          headerColor='#fae5d4'
          saveRow={saveRowToSharePoint}
          ButtonTitle='JVAP'
        />
      </Box>

      {isVisible && (
        <Box mb={3} p={2} boxShadow={3} borderRadius={2}>
          <SubCustomTable
            columns={columns3}
            data={data3}
            onAdd={handleAddRowFunding}
            onEdit={(id, updatedRow) => handleEditRow(updatedRow)}
            onDelete={() => handleDeleteRow(setData3, data3)}
            headerColor='#efedb6'
            saveRow={saveRowToSharePoint}
            ButtonTitle='Funding'
          />
        </Box>
      )}
    </>
  )}
</>

</Box>

  );
};

export default ProjectForm;

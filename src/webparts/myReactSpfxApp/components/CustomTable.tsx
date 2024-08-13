import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField
} from '@mui/material';
import EditProjectModal from './EditProjectModal';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ButtonBar from './ButtonBar';
import AddProjectModal from './AddProjectModal';
import { RowData, Column } from './types';
import { getAllProjectsByCurrentUser ,updateItemById,deleteItem,getRelatedTabByProject} from '../../services/sharepointService'; // Adjust import path as necessary
import TablePagination from '@mui/material/TablePagination';
import CustomChip from './CustomChip'; // Import CustomChip
import { tagColors } from './CustomChip'; // Adjust path as necessary
import { SelectChangeEvent } from '@mui/material/Select';
interface CustomTableProps {
  columns: Column[];
  data: RowData[];
  setData: React.Dispatch<React.SetStateAction<RowData[]>>;
}

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, setData }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false); 
  const [selectedProject, setSelectedProject] = useState<RowData | null>(null); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const fetchCountries = async (listName: string, currentItemId: number) => {
    try {
      const countries = await getRelatedTabByProject(listName, currentItemId);
      const countryNames = countries.map(country => country.Title).join('; ');
      console.log('Countries:', countryNames);
      return countryNames;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return ''; // Return an empty string or handle the error accordingly
    }
  };
  
  const fetchDonors = async (listName: string, currentItemId: number) => {
    try {
      const donors = await getRelatedTabByProject(listName, currentItemId);
      const donorNames = donors.map(donor => donor.FundingPartnerName).join('; ');
      console.log('DonorNames:', donorNames);
      return donorNames;
    } catch (error) {
      console.error('Error fetching donors:', error);
      return ''; // Return an empty string or handle the error accordingly
    }
  };
  
  const fetchProjects = async () => {
    try {
      // Fetch all projects
      const projects = await getAllProjectsByCurrentUser('Project');
  
      // Use Promise.all to handle async operations inside map
      const formattedProjects = await Promise.all(projects.map(async (project: any) => {
        // Fetch countries and donors for each project
        const countryNames = await fetchCountries('CountryImplementation', project.ID);
        const donorNames = await fetchDonors('Funding', project.ID);
  
        return {
          ...project,
          id: project.ID, // Preserve SharePoint ID
          countryImplementation: countryNames,
          donorsNames: donorNames
        };
      }));
  
      setData(formattedProjects);
      console.log('Formatted Projects:', formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  

 

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        const data1 = await getRelatedTabByProject('CountryImplementation');
        setData1(data1);
        console.log(data1)

      } catch (error) {
        console.error('Error fetching data for tabs:', error);
      }
    };

    fetchData();
  }, []);*/
  useEffect(() => {
    fetchProjects();
    console.log(setData);
  }, [setData]);

  const handleSelectRow = (index: number) => {
    const actualIndex = page * rowsPerPage + index;
    const newSelectedRows = [...selectedRows];
    if (newSelectedRows.includes(actualIndex)) {
      newSelectedRows.splice(newSelectedRows.indexOf(actualIndex), 1);
    } else {
      newSelectedRows.push(actualIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = filteredData.map((_, index) => page * rowsPerPage + index);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };
  const handleEdit = () => {
    if (selectedRows.length > 0) {
      const selectedIndex = selectedRows[0];
      const projectToEdit = data[selectedIndex];
      sessionStorage.removeItem('createdItemId');
      setSelectedProject(projectToEdit);
      sessionStorage.setItem('createdItemId', projectToEdit.id.toString());
      console.log(projectToEdit.id.toString())
      console.log(projectToEdit)
      setEditModalOpen(true);
    }
  };
  const handleSelectColumnChange = (event: SelectChangeEvent<string>) => {
    setSelectedColumn(event.target.value);
  };

  const handleFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const filteredData = data.filter((row) => {
    if (!selectedColumn) return true;
    const value = row[selectedColumn as keyof RowData]?.toString() ?? '';
    return value.toLowerCase().includes(filterText.toLowerCase());
  });
  const handleDeleteSelected = async() => {
    if (selectedRows.length > 0) {
      const selectedIndex = selectedRows[0];
      const projectToEdit = data[selectedIndex];  
      try {
        const deleteDataPromises = data.map(async (item, index) => {
          if (selectedRows.includes(index)) {
            await deleteItem("Project", projectToEdit.id);
          }
          return item;
        });
  
        const updatedData = await Promise.all(deleteDataPromises);
  
        setData(updatedData);
  
        console.log('Item updated and data refreshed');
      } catch (error) {
        console.error('Error updating item or fetching data:', error);
      }
    }};

  const handleAdd = () => {
    setModalOpen(true);
    fetchProjects();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchProjects();
   
  };

  const handleApprove = async () => {
    if (selectedRows.length > 0) {
      const selectedIndex = selectedRows[0];
      const projectToEdit = data[selectedIndex];
      sessionStorage.removeItem('createdItemId');
      setSelectedProject(projectToEdit);
      sessionStorage.setItem('createdItemId', projectToEdit.id.toString());
      var projectId = Number(sessionStorage.getItem('createdItemId'));
  
      try {
        // Update the item in the data source
        const updatedDataPromises = data.map(async (item, index) => {
          if (selectedRows.includes(index)) {
            await updateItemById("Project", projectId, { Approved: 'Yes' });
            return { ...item, Approved: 'Yes', color: '#eef8ee' };
          }
          return item;
        });
  
        // Wait for all updates to complete
        const updatedData = await Promise.all(updatedDataPromises);
  
        // Update state with new data
        setData(updatedData);
        fetchProjects();
  
        // Optionally, handle success or show a message
        console.log('Item updated and data refreshed');
      } catch (error) {
        console.error('Error updating item or fetching data:', error);
      }
    }
  
    // Clear selected rows
    setSelectedRows([]);
  };

  /*const filteredData = data.filter(row =>
    columns.some(column =>
      (row[column.id as keyof RowData]?.toString() ?? '').toLowerCase().includes(filterText.toLowerCase())
    )
  );*/

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <ButtonBar
        selectedRows={selectedRows}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDeleteSelected}
        handleApprove={handleApprove}
      />
      <Box sx={{ display: 'flex', marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 200 }}>
          <InputLabel id="filter-column-label" size='small'
            //sx={{ fontSize: '0.8rem', top: '-6px' }} 
            >Filter by Column</InputLabel>
          <Select
            labelId="filter-column-label"
            id="filter-column"
            value={selectedColumn}
            onChange={handleSelectColumnChange}
            label="Filter by Column"
            size='small'
            //sx={{ fontSize: '0.8rem', top: '-6px' }}

          >
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={`Filter by ${selectedColumn ? columns.find(col => col.id === selectedColumn)?.label : 'any column'}`}
          variant="outlined"
          value={filterText}
          onChange={handleFilterTextChange}
          fullWidth
          size='small'
          //sx={{ fontSize: '0.8rem', top: '-6px' }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400, maxWidth: 800 }}>
        <Table stickyHeader>
          <TableHead style={{ backgroundColor: '#f5fbff' }}>
            <TableRow>
              <TableCell style={{ backgroundColor: '#f5fbff' }} padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < filteredData.length
                  }
                  checked={selectedRows.length === filteredData.length}
                  onChange={handleSelectAll}
                  icon={<CircleOutlinedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell style={{ backgroundColor: '#f5fbff' }} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ backgroundColor: row.color ?? 'inherit' }} // Update row color
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(page * rowsPerPage + index)}
                    onChange={() => handleSelectRow(index)}
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {row[column.id as keyof RowData] != null ? (
                      // Conditionally render CustomChip for specific columns
                      ['Status', 'Approved', 'InitiativeType'].includes(column.id) ? (
                        <CustomChip
                          label={row[column.id as keyof RowData]?.toString() ?? ''}
                          tag={column.id as keyof typeof tagColors} // Adjust according to your column IDs
                        />
                      ) : (
                        row[column.id as keyof RowData]?.toString() ?? ''
                      )
                    ) : (
                      ''
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AddProjectModal
        open={modalOpen}
        onClose={handleCloseModal}
        mode="new"
        
      />
      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        selectedProject={selectedProject}
        mode="edit"
      />
    </Box>
  );
};

export default CustomTable;

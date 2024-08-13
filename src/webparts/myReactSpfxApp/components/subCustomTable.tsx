import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SubGridButtonBar from './SubGridButtonBar';
import { getListItems, IListItem } from '../../services/sharepointService';

interface Column {
  id: string;
  label: string;
}

interface RowData {
  id?: number;
  [key: string]: any;
}

interface SubCustomTableProps {
  columns: Column[];
  data: RowData[];
  onAdd?: () => void;
  onEdit: (ProjectReferenceID: number, updatedRow: RowData) => void;
  onDelete?: () => void;
  headerColor?: string;
  ButtonTitle?: string;
  saveRow?: (row: RowData) => void;
  mode: string;

}

const SubCustomTable: React.FC<SubCustomTableProps> = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  headerColor,
  saveRow,
  ButtonTitle,
  mode
}) => {
  const [Country, setCountry] = useState<IListItem[]>([]);
  const [InstitutionTypes, setInstitutionTypes] = useState<IListItem[]>([]);
  const [CountryType, setCountryType] = useState<IListItem[]>([]);
  const [JVAPDomains, setJVAPDomains] = useState<IListItem[]>([]);
  const [JVAPPriorities, setJVAPPriorities] = useState<IListItem[]>([]);
  const [rows, setRows] = useState<RowData[]>(data);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<RowData | null>(null);
  const [ImplementingOrganisationList, setImplementingOrganisationList] = useState<IListItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await getListItems('COUNTRY');
        setCountry(countries);

        const institutionTypes = await getListItems('INSTITUTION_TYPES');
        setInstitutionTypes(institutionTypes);

        const countryTypeItems = await getListItems('COUNTRY_TYPES');
        setCountryType(countryTypeItems);

        const JVAPDomainsItems = await getListItems('JVAP_DOMAINS');
        setJVAPDomains(JVAPDomainsItems);

        const JVAPPrioritiesTypeItems = await getListItems('JVAP_PRIORITIES');
        setJVAPPriorities(JVAPPrioritiesTypeItems);

        const implementingOrganisationListItems = await getListItems('IMPLEMENTATION_ORGANISATION_TYPES');
        setImplementingOrganisationList(implementingOrganisationListItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectRow = (index: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((rowIndex) => rowIndex !== index)
        : [...prevSelectedRows, index]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(event.target.checked ? rows.map((_, index) => index) : []);
  };

  const handleAddRow = () => {
    setNewRow({});
    setEditingRow(rows.length);
  };

  const handleChangeNewRow = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewRow((prevNewRow) => ({ ...prevNewRow, [name]: value }));
  };

  const handleSaveNewRow = () => {
    if (newRow && Object.keys(newRow).length > 0) {
      const newRowWithId = { ...newRow, ProjectReferenceID: Number(sessionStorage.getItem('createdItemId')) };
      setRows([...rows, newRowWithId]);
      setNewRow(null);
      setEditingRow(null);
      if (onAdd) onAdd();
      if (saveRow) saveRow(newRowWithId);
    }
  };

  const handleCancelNewRow = () => {
    setNewRow(null);
    setEditingRow(null);
  };

  const handleChangeEditRow = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, [name]: value } : row
      )
    );
  };

  const handleEditRow = (index: number) => {
    setEditingRow(index);
    if (rows[index]) {
      const rowToEdit = rows[index];
      if (onEdit && rowToEdit.ProjectReferenceID != null) {
        onEdit(rowToEdit.ProjectReferenceID, rowToEdit);
      }
    }
  };

  /*const handleSaveEdit = () => {
    if (editingRow !== null) {
      setEditingRow(null);
      const rowToSave = rows[editingRow];
      if (saveRow) saveRow(rowToSave);
    }
  };*/

  const handleDeleteSelected = () => {
    const updatedRows = rows.filter((_, index) => !selectedRows.includes(index));
    setRows(updatedRows);
    setSelectedRows([]);
    if (onDelete) onDelete();
  };

  const handleSelectChangeNewRow = (columnId: string, newValue: string | null) => {
    setNewRow((prevRow) => ({
      ...prevRow,
      [columnId]: newValue || '',
    }));
  };

  const handleSelectChangeEditRow = (index: number, columnId: string, newValue: string | null) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [columnId]: newValue || '' }
          : row
      )
    );
  };

  const shouldShowAddNewButton = selectedRows.length === 0;

  const isDropDownField = (columnId: string) => {
    return columnId in dropDownOptions;
  };

  const dropDownOptions: { [key: string]: string[] } = {
    Title: Country.map((item) => item.Title),
    Category: InstitutionTypes.map((item) => item.Title),
    FundingPartnerCompany: CountryType.map((item) => item.Title),
    FundingPartnerName: Country.map((item) => item.Title),
    ImplementingOrganisation: ImplementingOrganisationList.map((item) => item.Title),
    JVAPDomains: JVAPDomains.map((item) => item.DomainName),
    JVAPPriorities: JVAPPriorities.map((item) => item.Priority),
  };

  return (
    <Box>
      <SubGridButtonBar
        onAdd={shouldShowAddNewButton ? handleAddRow : undefined}
        onEdit={() => {
          if (selectedRows.length === 1) {
            handleEditRow(selectedRows[0]);
          }
        }}
        onDelete={handleDeleteSelected}
        isEditing={selectedRows.length === 1 || newRow !== null}
        showDelete={selectedRows.length > 0}
        showAddNew={shouldShowAddNewButton}
        ButtonTitle={ButtonTitle}
      />
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead style={{ backgroundColor: headerColor }}>
            <TableRow>
              <TableCell style={{ backgroundColor: headerColor }} padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                  checked={selectedRows.length === rows.length}
                  onChange={handleSelectAll}
                  icon={<CircleOutlinedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell style={{ backgroundColor: headerColor }} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell style={{ backgroundColor: headerColor }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...rows, ...(newRow ? [newRow] : [])].map((row, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(index)}
                    onChange={() => handleSelectRow(index)}
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {editingRow === index ? (
                      isDropDownField(column.id) ? (
                        <Autocomplete
                          value={row[column.id] || ''}
                          onChange={(_, newValue) => {
                            if (newRow) {
                              handleSelectChangeNewRow(column.id, newValue);
                            } else {
                              handleSelectChangeEditRow(index, column.id, newValue);
                            }
                          }}
                          options={dropDownOptions[column.id]}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      ) : (
                        <TextField
                          name={column.id}
                          value={row[column.id] || ''}
                          onChange={(event) => {
                            if (newRow) {
                              handleChangeNewRow(event);
                            } else {
                              handleChangeEditRow(index, event);
                            }
                          }}
                        />
                      )
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editingRow === index ? (
                    <>
                      <Button onClick={handleSaveNewRow}>Save</Button>
                      <Button onClick={handleCancelNewRow}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEditRow(index)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubCustomTable;

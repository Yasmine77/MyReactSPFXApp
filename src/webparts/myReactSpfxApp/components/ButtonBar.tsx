import * as React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

interface ButtonBarProps {
  selectedRows: number[];
  handleAdd: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleApprove: () => void;
}

const ButtonBar: React.FC<ButtonBarProps> = ({ selectedRows, handleAdd, handleEdit, handleDelete, handleApprove }) => {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Button startIcon={<AddIcon />} onClick={handleAdd}>
        Add new Project
      </Button>
      {selectedRows.length === 1 && (
        <Button startIcon={<GridViewIcon />} onClick={handleEdit}>
          Edit Project
        </Button>
      )}
      {selectedRows.length > 0 && (
        <Button startIcon={<DeleteIcon />} onClick={handleDelete}>
          Delete
        </Button>
      )}
      {selectedRows.length > 0 && (
        <Button startIcon={<ThumbUpIcon />} onClick={handleApprove}>
          Approve
        </Button>
      )}
    </Box>
  );
};

export default ButtonBar;

import * as React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import DeleteIcon from '@mui/icons-material/Delete';

interface SubGridButtonBarProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  showDelete?: boolean;
  showAddNew?: boolean; 
  ButtonTitle?: string

}

const SubGridButtonBar: React.FC<SubGridButtonBarProps> = ({
  onAdd,
  onEdit,
  onDelete,
  isEditing,
  showDelete,
  showAddNew,
  ButtonTitle
}) => {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      {showAddNew && (
        <Button
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
         Add {ButtonTitle}
        </Button>
      )}
    
      <Box ml={1}>
        <Button
          startIcon={<GridViewIcon />}
          onClick={onEdit}
          disabled={!isEditing}
        >
          Edit {ButtonTitle} in Grid View
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          disabled={!showDelete}
          sx={{ marginLeft: 1 }}
        >
          Delete {ButtonTitle}
        </Button>
      </Box>
    </Box>
  );
};

export default SubGridButtonBar;

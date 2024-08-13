import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import ProjectForm from './ProjectForm'; 
import { useState, useEffect, ChangeEvent } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getListItems, IListItem } from '../../services/sharepointService';
import { Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'edit' | 'new';
}


const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onClose, mode }) => {
  const emptyProject = {};
  const [policyTypes, setPolicyTypes] = useState<IListItem[]>([]);
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>('Project');
  console.log(selectedPolicyType)
  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const types = await getListItems('POLICY_TYPE');
        setPolicyTypes(types);
      } catch (error) {
        console.error('Error fetching project types:', error);
      }
    };

    fetchProjectTypes();
  }, []);

  const handlePolicyTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPolicyType(event.target.value);
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ padding: 2 }}>
        Project Information
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Box display="flex" flexDirection="column" gap={2} sx={{ marginTop: '10px' }}>
          <RadioGroup
            name="InitiativeType"
            value={selectedPolicyType}
            onChange={handlePolicyTypeChange}
            row 
            sx={{ minWidth: 300 }} // Adjust width as necessary
          >
            {policyTypes.map((type) => (
              <FormControlLabel
                key={type.Id}
                value={type.Title}
                control={<Radio size="small" />}
                label={type.Title}
              />
            ))}
          </RadioGroup>
          <ProjectForm initiativeType={selectedPolicyType} project={emptyProject} mode={mode} selectedProjectId={''} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;

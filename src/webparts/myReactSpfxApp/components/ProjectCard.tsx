import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Box, Button, TextField, MenuItem, InputAdornment } from '@mui/material';
import { getListItems, IListItem } from '../../services/sharepointService';
import { createItem, updateItemById } from '../../services/sharepointService';
//import CustomChip from './CustomChip'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
interface ProjectCardProps {
  project: {
    Title: string;
    InitiativeType: string;
    Status: string;
    StartYear: string;
    EndYear: string;
    DatabaseStatus: string;
    Budget: string;
    IATI: string;
    Approved: string;
    Comments: string;
  };
  onSave: (saved: boolean) => void;
  mode: 'edit' | 'new';
  initiativeType: string;
  selectedProjectId:string
}

const ProjectCard: React.FC<ProjectCardProps> = ({ initiativeType, project, onSave, mode,selectedProjectId }) => {
  const [newProject, setNewProject] = useState(project);
  const [projectTypes, setProjectTypes] = useState<IListItem[]>([]);
  const [modeChange] = useState<String>(mode);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  //const [projectId, setProjectId] = useState<number>();
  const [isSaved, setIsSaved] = useState(false);

  const [errors, setErrors] = useState({
    Title: '',
    StartYear: '',
    Budget: '',
    EndYear: '',
    Status: ''
  });
  /*const approvedOptions = [
    { key: 'yes', value: 'Yes' },
    { key: 'no', value: 'No' }
  ];*/

  const getApprovedIcon = () => {
    if (newProject.Approved === 'Yes') {
      return <CheckCircleIcon sx={{ color: 'green', marginLeft: 1 }} />;
    } else if (newProject.Approved === 'No') {
      return <CancelIcon sx={{ color: 'red', marginLeft: 1 }} />;
    }
    return null;
  };

  const LIST_NAME = "Project";

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const types = await getListItems('PROJECT_TYPE');
        setProjectTypes(types);
      } catch (error) {
        console.error('Error fetching project types:', error);
      }
    };

    fetchProjectTypes();
  }, []);

  useEffect(() => {
    setNewProject({ ...project })
  }, [project]);

  /*useEffect(() => {
    const fetchPolicyTypes = async () => {
      try {
        const types = await getListItems('POLICY_TYPE'); // Use the appropriate key
        setPolicyTypes(types);
      } catch (error) {
        console.error('Error fetching policy types:', error);
      }
    };

    fetchPolicyTypes();
  }, []);
*/
  /* const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setNewProject((prevProject) => ({
       ...prevProject,
       [name]: value,
     }));
     if (name === 'InitiativeType') {
       setIsVisible(value === 'Project');
     }
   };*/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsVisible(initiativeType === 'Project');
  }, [initiativeType]);



  const handleSave = async () => {
    if (!validateFields()) {
      return alert("Project cannot be created. Missing or invalid fields")
    }
    // Create a descriptive alert message
    //let alertMessage = 'Project cannot be created. Missing or invalid fields:';

    /*for (const [field, error] of Object.entries(errors)) {
      if (error) {
        alertMessage += `\n- ${field}: ${error}`;
      }
    }
 
    alert(alertMessage);
    return;
  }*/

    try {
      sessionStorage.removeItem('createdItemId');
      const response = await createItem(LIST_NAME, {
        Title: newProject.Title,
        Status: newProject.Status,
        InitiativeType: initiativeType,
        StartYear: newProject.StartYear,
        EndYear: newProject.EndYear,
        Budget: Number(newProject.Budget),
        Comments: newProject.Comments,
        IATI: newProject.IATI,
        Approved: newProject.Approved,
      });
      console.log("response", response);
      alert('Project item created successfully');
      //setProjectId(response.ID)
      sessionStorage.setItem('createdItemId', response.ID.toString());
      //console.log("Response", response.ID.toString())
      setIsSaved(true);
      onSave(true);

    } catch (error) {
      console.error('Error saving project item:', error);
    }
  };


  const handleEdit = async () => {
    if (!validateFields()) {
      return alert('Please correct the errors in the form.');
    }

    try {
      const updatedData = {
        Title: newProject.Title,
        Status: newProject.Status,
        InitiativeType: initiativeType,
        StartYear: newProject.StartYear,
        EndYear: newProject.EndYear,
        Budget: Number(newProject.Budget),
        Comments: newProject.Comments,
        IATI: newProject.IATI,
        Approved: 'No',
      };
      var projectId = Number(selectedProjectId);
      await updateItemById("Project", projectId, updatedData);

      alert('Project item updated successfully');
      onSave(true);
    } catch (error) {
      console.error('Error updating project item:', error);
    }
  };
  const validateFields = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    let errors = {
      Title: '',
      StartYear: '',
      Budget: '',
      EndYear: '',
      Status: '',

    };

    if (!newProject.Title) {
      errors.Title = 'Title is required';
      isValid = false;
      newErrors.Title = 'Title is required.';
    }
    if (!newProject.Status) {
      errors.Status = 'Status is required';
      isValid = false;
      newErrors.Status = 'Status is required.';
    }

    if (!newProject.StartYear || isNaN(Number(newProject.StartYear))) {
      errors.StartYear = 'Start Year must be a valid number';
      isValid = false;
      newErrors.StartYear = 'Start Year is required.';
    }

    if (!newProject.Budget && initiativeType == 'Project' || isNaN(Number(newProject.Budget)) &&initiativeType == 'Project') {
      errors.Budget = 'Budget must be a valid number';
      isValid = false;
      newErrors.Budget = 'Budget is required.';

    }

    if (!newProject.EndYear && initiativeType == 'Project' && isNaN(Number(newProject.EndYear))&& initiativeType == 'Project') {
      errors.EndYear = 'End Year must be a valid number';
      isValid = false;
      newErrors.EndYear = 'End Year is required.';
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <Card sx={{ padding: 2, mb: 2, position: 'relative', borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <Box ml={1}>
          {modeChange === 'edit' ? (
      <TextField
        name="Approved"
        label="Approved"
        value={newProject.Approved}
        onChange={handleChange}
        defaultValue={"No"}
        sx={{ width: '150px' }}
        select
        InputProps={{
          startAdornment: (() => {
            const icon = getApprovedIcon();
            return icon ? (
              <InputAdornment position="start" sx={{ marginRight: 1 }}>
                {React.cloneElement(icon, { fontSize: 'small', sx: { fontSize: 16, color: 'inherit' } })}
              </InputAdornment>
            ) : null;
          })(),
        }}
        InputLabelProps={{ shrink: true }}
        size="small"
      >
        {/* Assuming you have some menu items here */}
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </TextField>
    ) : null}

          </Box>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" alignItems="center">
              <Box ml={1}>

                <TextField

                  name="Status"
                  label="Status"
                  value={newProject.Status}
                  onChange={handleChange}
                  fullWidth
                  select
                  size="small"
                  sx={{ width: '150px' }}
                  helperText={errors.Status}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.Status}

                >
                  {projectTypes.map((status) => (
                    <MenuItem key={status.Id} value={status.Title}>
                      {status.Title}
                    </MenuItem>
                  ))}
                </TextField>

              </Box>
            </Box>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="Title"
              label="Title"
              value={newProject.Title}
              helperText={errors.Title}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
              error={!!errors.Title}
            />

          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="StartYear"
              label="Start Year"
              value={newProject.StartYear}
              onChange={handleChange}
              helperText={errors.StartYear}
              fullWidth
              size="small"
              error={!!errors.StartYear}
              InputLabelProps={{ shrink: true }}
            />

          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            {isVisible && (
              <div>
                <TextField
                  name="EndYear"
                  label="End Year"
                  value={newProject.EndYear}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  error={!!errors.EndYear}
                  helperText={errors.EndYear}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

              </div>
            )}
          </Grid>


          <Grid item xs={12} sm={6} md={4}>
     
<TextField
                  name="IATI"
                  label="IATI"
                  value={newProject.IATI}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

          </Grid>

          <Grid item xs={12} sm={6} md={4}>
          {isVisible && (
              <div>
<TextField
              name="Budget"
              label="Total Budget:"
              value={newProject.Budget}
              onChange={handleChange}
              fullWidth
              size="small"
              helperText={errors.Budget}
              error={!!errors.Budget}
              InputLabelProps={{
                shrink: true,
              }}
            />
                

              </div>
            )}

          </Grid>
          <Grid item xs={12}>

            <TextField
              name="Comments"
              label="Project Description"
              value={newProject.Comments || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              multiline
              rows={4}
            />

          </Grid>
        </Grid>
        {modeChange === 'new' ? (
          <Box mt={2} display="flex" justifyContent="flex-end">
            {!isSaved ? (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleEdit}>
                Edit
              </Button>
            )}

          </Box>
        ) :
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleEdit} >
              Edit
            </Button>
          </Box>


        }
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

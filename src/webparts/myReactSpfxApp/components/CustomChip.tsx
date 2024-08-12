import * as React from 'react';
import * as PropTypes from 'prop-types'; 
import { Chip } from '@mui/material';
import { styled } from '@mui/system';

export const tagColors: Record<string, { backgroundColor: string; textColor: string }> = {
  implementationStatus: { backgroundColor: '#c1f1c0', textColor: '#888e88' },
  regionalStatus: { backgroundColor: '#faf0f2', textColor: '#db5b7b' },
  regionalDialogue: { backgroundColor: '#d9ebff', textColor: '#88c1ff' },
  databaseStatus: { backgroundColor: '#faf0f2', textColor: '#fbcd97' },
  Status: { backgroundColor: '#FBC02D', textColor: '#FFFFFF' },
  type: { backgroundColor: '#616161', textColor: '#FFFFFF' },
  Approved: { backgroundColor: '#faf0f2', textColor: '#fbcd97' },
  InitiativeType: { backgroundColor: '#c1f1c0', textColor: '#888e88' },
};


const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'tag',
})<{ tag: string }>(({ tag }) => ({
  backgroundColor: tagColors[tag]?.backgroundColor || '#e0e0e0',
  color: tagColors[tag]?.textColor || '#000000',
}));

interface CustomChipProps {
  label: string;
  tag: keyof typeof tagColors;
}

const CustomChip: React.FC<CustomChipProps> = ({ label, tag }) => {
  return <StyledChip label={label} tag={tag} />;
};

CustomChip.propTypes = {
    label: PropTypes.string.isRequired,
    tag: PropTypes.oneOf(Object.keys(tagColors) as Array<string>).isRequired,
  };
  

export default CustomChip;

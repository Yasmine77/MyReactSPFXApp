import * as React from 'react';
import { Card, Avatar, Grid, Typography,Link , CardContent} from '@mui/material';
import { deepPurple } from '@mui/material/colors';

interface Contact {
  image?: string;
  name?: string;
  telephone?: string;
  email?: string;
  department?: string;
  institution?: string;
}

interface ContactCardProps {
  contact: Contact;
  onContactChange: (updatedContact: Contact) => void;
}


const ContactCard: React.FC<ContactCardProps> = ({ contact, onContactChange }) => {



  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 2,  boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
    }}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          marginRight: 2,
          bgcolor: contact.image ? 'transparent' : deepPurple[500],
          alignSelf: 'center',
          ml: 'auto',
        }}
        src={contact.image}
        alt={contact.name}
      >
        {!contact.image && getInitials(contact.name)}
      </Avatar>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{contact.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{contact.telephone}</Typography>
            <Link href={`mailto:${contact.email}`} variant="body2">
              {contact.email}
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{contact.department}</Typography>
            <Typography variant="body2">{contact.institution}</Typography>
          </Grid>
        </Grid>
      </CardContent>
        
    
    </Card>
  );
};

export default ContactCard;

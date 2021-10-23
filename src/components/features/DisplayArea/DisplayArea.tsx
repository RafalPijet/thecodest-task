import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { Props, useStyles } from './DisplayAreaStyle';

const DisplayArea: React.FC<Props> = (props) => {
  const { convertedText } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.root} variant="outlined">
      <Typography align="justify" className={classes.text}>
        {convertedText}
      </Typography>
    </Paper>
  );
};

export default DisplayArea;

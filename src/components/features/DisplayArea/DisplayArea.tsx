import React from 'react';
import classNames from 'classnames';
import { Paper, Typography, CircularProgress } from '@material-ui/core';
import { Props, useStyles } from './DisplayAreaStyle';

const DisplayArea: React.FC<Props> = (props) => {
  const { convertedText, isPending } = props;
  const classes = useStyles();

  const rootClasses = classNames({
    [classes.root]: true,
    [classes.center]: isPending,
  });
  return (
    <Paper className={rootClasses} variant="outlined">
      {isPending ? (
        <CircularProgress className={classes.spiner} />
      ) : (
        <Typography align="justify" className={classes.text}>
          {convertedText}
        </Typography>
      )}
    </Paper>
  );
};

export default DisplayArea;

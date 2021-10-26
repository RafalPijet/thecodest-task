import { makeStyles, createStyles } from '@material-ui/core/styles';
import { container } from '../../../globalStyles'

export const useStyles = makeStyles(() => createStyles({
    container: {
        ...container,
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: "1500px",
        overflow: "hidden",
        position: "relative",
        backgroundPosition: "top center",
        backgroundSize: "cover",
        margin: "0",
        padding: "0",
        border: "0",
        alignItems: "center",
        "&:before": {
            background: "rgba(0, 0, 0, 0.2)"
        },
    },
    title: {
        padding: 30
    }
}))
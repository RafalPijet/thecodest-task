import { makeStyles, createStyles } from '@material-ui/core/styles';
import { displayColor, secondaryColor } from '../../../globalStyles'

export const useStyles = makeStyles(() => createStyles({
    root: {
        padding: 10,
        margin: 10,
        background: "linear-gradient(180deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,.1) 61%, rgba(255,255,255,0) 100%)",
        height: 610,
        overflowY: 'auto'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spiner: {
        color: secondaryColor
    },
    text: {
        color: displayColor
    }
}))

export interface Props {
    convertedText: string;
    isPending: boolean;
}
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { primaryColor, secondaryColor } from '../../../globalStyles'

export const useStyles = makeStyles(() => createStyles({
    root: {
        padding: 10,
        margin: 10,
        background: "linear-gradient(180deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,.1) 61%, rgba(255,255,255,0) 100%)",
    },
    textField: {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: secondaryColor
        },
        '& .MuiFormLabel-root': {
            color: secondaryColor
        },
        '& .MuiInputBase-input': {
            color: primaryColor
        }

    }
}))

export interface Props {
    getContentText: (text: string) => void;
    setCorrectlyText: string | null;
}
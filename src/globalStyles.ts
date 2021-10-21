const containerFluid = {
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%"
};
const container = {
    ...containerFluid,
    "@media (min-width: 400px)": {
        maxWidth: "320px",
    },
    "@media (min-width: 576px)": {
        maxWidth: "540px",
    },
    "@media (min-width: 768px)": {
        maxWidth: "720px",
    },
    "@media (min-width: 992px)": {
        maxWidth: "960px"
    },
    "@media (min-width: 1200px)": {
        maxWidth: "1140px"
    },
    "@media (min-width: 1500px)": {
        maxWidth: "1440px"
    }
};

const primaryColor = '#6A0572';
const secondaryColor = '#34FFC8';
const disabledColor = '#9991af';

export {
    containerFluid,
    container,
    primaryColor,
    secondaryColor,
    disabledColor
}
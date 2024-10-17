

export const between = (target : Date, startDate : Date, endDate : Date ) => {
    return (startDate.getTime() <= new Date(target).getTime() 
    && endDate.getTime() >= new Date(target).getTime() ) ? true : false;
    }
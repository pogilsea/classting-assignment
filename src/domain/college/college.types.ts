export type RegisterCollege = {id?: number} & CollegeObjectValue;

export type CollegeProps = CollegeObjectValue;

export type CollegeObjectValue = {
    name: string;
    local: string;
};

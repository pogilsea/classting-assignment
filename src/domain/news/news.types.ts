export type RegisterNews = {id?: number; collegeId: number} & NewsObjectValue;
export type EditNews = {id: number; updatedAt: string} & NewsObjectValue;
export type DeleteNews = {id: number};

export type RegisterNewsProps = {
    collegeId: number;
    title: string;
    content: string;
};
export type EditNewsProps = {newsId: number} & Partial<NewsObjectValue>;

export type NewsObjectValue = {
    title: string;
    content: string;
};

export type NewsResponseEntity = {
    id: number;
    createdAt: Date;
} & NewsObjectValue;

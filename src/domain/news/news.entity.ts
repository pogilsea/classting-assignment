import {removeUndefinedProps} from '@lib/remove-undefined-props';
import {DeleteNews, EditNews, EditNewsProps, RegisterNews, RegisterNewsProps} from '@domain/news/news.types';

export interface INews {
    registerNews(props: RegisterNewsProps): RegisterNews;
    editNews(props: EditNewsProps): EditNews;
    deleteNews(id: number): DeleteNews;
}

export class News implements INews {
    registerNews(props: RegisterNewsProps) {
        const {collegeId, title, content} = props;
        return {collegeId, title, content};
    }
    editNews(props: EditNewsProps) {
        const {newsId, ...data} = props;
        const propsData = removeUndefinedProps(data);
        return {
            id: newsId,
            ...propsData,
        };
    }
    deleteNews(id: number) {
        return {id};
    }
}

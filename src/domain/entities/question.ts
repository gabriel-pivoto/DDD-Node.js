import { randomUUID } from "node:crypto";

interface QuestionProps {
    title: string;
    content: string;
    authorId: string;
}

export class Question {
    public title: string;
    public id: string;
    public content: string;
    public authorId: string;

    constructor(props: QuestionProps, id?: string) {
        this.content = props.content;
        this.authorId = props.authorId;
        this.title = props.title;
        this.id = id ?? randomUUID();
    }
}

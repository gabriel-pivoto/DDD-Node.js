import { randomUUID } from "node:crypto";

export class Question {
    public title: string;
    public id: string;
    public content: string;

    constructor(title: string, content: string, id?: string) {
        this.title = title;
        this.id = id ?? randomUUID();
        this.content = content;
    }
}

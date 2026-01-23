import { randomUUID } from "node:crypto";
import { Slug } from "./value-objects/slug";

interface QuestionProps {
    title: string;
    content: string;
    slug: Slug;
    authorId: string;
}

export class Question {
  public title: string;
  public id: string;
  public content: string;
  public slug: Slug;
  public authorId: string;

  constructor(props: QuestionProps, id?: string) {
    this.content = props.content;
    this.authorId = props.authorId;
    this.title = props.title;
    this.slug = props.slug;
    this.id = id ?? randomUUID();
  }
}

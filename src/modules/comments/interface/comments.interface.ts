export interface Comment {
  id?: string;
  userId: string;
  commentableType: string;
  commentableId: string;
  content: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

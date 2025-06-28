export interface CommentType {
    id: string;
    content: string;
    createdAt: string;
    author: {
      username: string;
      fullName: string;
      profileImage?: string;
    };
    replies?: CommentType[]; // Nested replies (optional)
  }
  export interface BlogResponse {
    title: string;
    content: string;
    createdAt: string;
    author: {
      username: string;
      fullName: string;
      profileImage?: string;
      followersCount: number;
      followingCount: number;
      isFollowed: boolean;
    };
    comments: CommentType[]; // Now using the newly created CommentType
  }
  
  
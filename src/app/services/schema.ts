export interface SignUpSchema {
    fullName: String;
    username: String;
    email: String;
    password: String;
}

export interface VerifyOtp {
    email: String;
    otp: String;
}
export interface Login {
    identifier: String;
    password: String;
}
export interface changePassword {
    currentPassword: String;
    newPassword: String;
}
export interface ResendOtp {
    email: String;
}
export interface ReactionPayload {
    reactionType: "like" | "amazing" | "dislike" | "confusing";
}

export interface CreateBlog {
    topic?: string;
    title?: string;
    content?: string;

    topicValue?: string;
    titleValue?: string;
    contentValue?: string;
}

export interface PostCommentInterface {
    slug: string;
    content: string;
}

export interface EditAboutSchema {
    about: string;
}

// what we send when saving a draft
export interface DraftPayload {
    topic: string;
    title: string;
    content: string;
}

// what we get back when fetching a draft
export interface DraftResponse {
    success: boolean;
    draft: {
        topic: string;
        title: string;
        content: string;
        updatedAt: string;    // ISO timestamp
    };
}
export interface EditFullNameSchema {
  fullName: string;
}
export interface EditUsernameSchema {
  username: string;
}

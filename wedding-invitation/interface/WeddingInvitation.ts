export interface WeddingInvitation {
    _id: string;
    slug?: string;
    fields?: { [key: string]: string };
    template?: {
        _id: string;
        name: string;
        thumbnail?: string;
        html?: string;
        css?: string;
        js?: string;
        dynamicFields?: Array<{
            id: string;
            name: string;
            type: string;
            defaultValue: string;
            description: string;
        }>;
    };
    groomName?: string;
    brideName?: string;
    user?: {
        _id: string;
        email: string;
    };
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
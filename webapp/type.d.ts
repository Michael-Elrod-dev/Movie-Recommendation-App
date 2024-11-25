declare module "*.json" {
    const content: {
        movieId: number;
        title: string;
        genre1: string;
        genre2: string;
        averageRating: number;
        ratingCount: number;
    }[];
    export = content;
}
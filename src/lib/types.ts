import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export function getPostDataInclude(userId?: string) {
  return {
    user: {
      select: userDataSelect,
    },
    likes: userId
      ? {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        }
      : false,
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}
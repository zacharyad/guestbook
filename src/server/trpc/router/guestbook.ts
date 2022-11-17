import {z} from "zod"
import {router, protectedProcedure, publicProcedure} from  "../trpc"

export const guestbookRouter = router({
    getAll: protectedProcedure.query(async ({ctx}) => {
        try {
            return await ctx.prisma.guestbook.findMany({
                select: {
                    name: true,
                    message: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        } catch (error) {
            console.log("Error: ", error)
        }
    }),
    postMessage: protectedProcedure
    .input(
        z.object({
            name: z.string(),
            message: z.string(),
        })
    )
    .mutation(async ({ctx, input}) => {
        try {
            await ctx.prisma.guestbook.create({
                data: {
                    name: input.name,
                    message: input.message
                }
            })
        } catch (error) {
            console.log("Error: ", error)
        }
    })
})
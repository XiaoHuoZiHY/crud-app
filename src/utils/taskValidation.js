import { z } from 'zod'

export const taskTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '标题不能为空')
    .max(100, '标题不能超过 100 个字符'),
})

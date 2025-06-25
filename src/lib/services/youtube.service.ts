import { YoutubeModel } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class YoutubeService {
  private getModel() {
    return prisma.zirospace_youtube
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getYoutube(): Promise<YoutubeModel | null> {
    const cachedFn = this.withCache(
      async () => {
        const model = this.getModel()
        return (model as any).findFirst()
      },
      `youtube-data`,
      [CACHE_TAGS.YOUTUBE]
    )
    return cachedFn()
  }

  async updateYoutube(youtubeUrl: string): Promise<YoutubeModel | null> {
    const model = this.getModel()
    return (model as any).update({
      where: { id: '123413123' }, // Assuming a fixed ID for the single YouTube entry
      data: { youtubeUrl },
    })
  }
}

export const youtubeService = new YoutubeService()
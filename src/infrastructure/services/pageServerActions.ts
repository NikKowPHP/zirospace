'use server'
import { heroService } from '@/lib/services/hero.service'
import { HeroModel } from '@/domain/models/models'

export async function updateHeroSectionAction(data: Partial<HeroModel>, locale: string) {
  return await heroService.updateHeroSection(data, locale)
}

export async function getHeroSectionAction(locale: string) {
  return await heroService.getHeroSection(locale)
}

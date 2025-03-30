'use server'
import { heroService } from '@/lib/services/hero.service'
import { HeroModel } from '@/domain/models/models'

export async function updateHeroSectionAction(data: Partial<HeroModel>) {
  return await heroService.updateHeroSection(data)
}

export async function getHeroSectionAction() {
  return await heroService.getHeroSection()
}

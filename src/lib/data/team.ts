export interface TeamItem {
  id: string
  author: string
  role: string
  company: string
  quote: string
  image: string
  imageAlt: string
  imagePerson: string
}

export const teamItems: TeamItem[] = [
  {
    id: 'nikhil',
    author: 'Nikhil Singh',
    role: 'team.nikhil.role',
    company: 'team.nikhil.company',
    quote: 'team.nikhil.quote',
    image: 'https://i.postimg.cc/T1nrzdwP/BCJ9upw-V2-ARbexiidm-P5w0okz-LE.avif',
    imageAlt: 'team.nikhil.imageAlt',
    imagePerson: 'https://i.postimg.cc/XJkjmtWb/morda.avif'
  },
  // Add more team members as needed
]

export async function getTeamItems(): Promise<TeamItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return teamItems
} 
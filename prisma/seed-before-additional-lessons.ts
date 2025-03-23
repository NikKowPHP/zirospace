import {  ProficiencyLevel } from '@prisma/client'
import prisma from '../src/lib/prisma'

async function main() {
  // Clear existing data in the correct order
  await prisma.lesson.deleteMany({}) // Delete lessons first
  await prisma.assessmentLesson.deleteMany({}) // Then delete assessment lessons
  await prisma.onboarding.deleteMany({}) // Then delete onboarding
  await prisma.user.deleteMany({}) // Finally delete users
  
  // Create test user (matching the mock auth service)
  const user = await prisma.user.create({
    data: {
      id: 'mock-user-id', // Use the same ID as in your mock auth service
      email: 'mock@example.com',
      name: 'Mock User',
    },
  })

  // Create onboarding data
  const onboarding = await prisma.onboarding.create({
    data: {
      userId: user.id,
      steps: {
        welcome: true,
        purpose: true,
        languages: true,
        proficiency: true 
      },
      completed:  true,
      learningPurpose: 'travel',
      nativeLanguage: 'English',
      targetLanguage: 'German',
      proficiencyLevel: ProficiencyLevel.beginner,
      initialAssessmentCompleted:  true,
    },
  })

  // Create assessment lessons
  const assessmentLessons = await Promise.all([
    prisma.assessmentLesson.create({
      data: {
        userId: user.id,
        step: 1,
        prompt: "How do you say: 'I would like to order?'",
        modelAnswer: "I would like to order",
        completed: true 
      }
    }),
    prisma.assessmentLesson.create({
      data: {
        userId: user.id,
        step: 2,
        prompt: "How do you say: 'Can I have the menu?'",
        modelAnswer: "Can I have the menu",
        completed: true 
      }
    }),
    prisma.assessmentLesson.create({
      data: {
        userId: user.id,
        step: 3,
        prompt: "How do you say: 'The check, please'",
        modelAnswer: "The check, please",
        completed: true 
      }
    }),
    prisma.assessmentLesson.create({
      data: {
        userId: user.id,
        step: 4,
        prompt: "How do you say: 'I would like to pay'",
        modelAnswer: "I would like to pay",
        completed: true 
      }
    }),
    prisma.assessmentLesson.create({
      data: {
        userId: user.id,
        step: 5,
        prompt: "How do you say: 'Do you accept credit cards?'",
        modelAnswer: "Do you accept credit cards",
        completed: true 
      }
    })
  ])

  // Create regular lessons
  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        userId: user.id,
        lessonId: 'lesson-1',
        focusArea: 'Everyday Conversation',
        targetSkills: ['Greetings', 'Small Talk'],
        steps: {
          create: [
            {
              stepNumber: 1,
              type: 'prompt',
              content: 'How do you introduce yourself?',
              translation: 'Wie stellst du dich vor?',
              attempts: 0,
              correct:  true,
              errorPatterns: []
            },
            {
              stepNumber: 2,
              type: 'model_answer',
              content: 'Hello, my name is...',
              translation: 'Hallo, ich heiße...',
              attempts: 0,
              correct:  true,
              errorPatterns: []
            }
          ]
        },
        completed: true 
      }
    }),
    // Add more lessons as needed
  ])

  console.log(`Created user: ${user.email}`)
  // console.log(`Created onboarding for user`)
  // console.log(`Created onboarding: ${onboarding.id}`)
  console.log(`Created ${assessmentLessons.length} assessment lessons`)
  console.log(`Created ${lessons.length} regular lessons`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

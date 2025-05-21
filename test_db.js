// test_db.js
import knexConfig from './knexfile';
import knex from 'knex';
const db = knex(knexConfig.development);

async function testQueries() {
  try {
    // Case Studies
    const enResults = await db('case_studies_en').select('*')
    console.log('case_studies_en:', enResults)

    const plResults = await db('case_studies_pl').select('*')
    console.log('case_studies_pl:', plResults)

    // Case Study Sliders
    const sliderResults = await db('case_study_sliders').select('*')
    console.log('case_study_sliders:', sliderResults)

    const sliderImagesResults = await db('case_study_slider_images').select(
      '*'
    )
    console.log('case_study_slider_images:', sliderImagesResults)

    // Join Slider and Images
    const joinedSliderData = await db('case_study_sliders')
      .select(
        'case_study_sliders.*',
        'case_study_slider_images.image',
        'case_study_slider_images.alt'
      )
      .join(
        'case_study_slider_images',
        'case_study_sliders.id',
        'case_study_slider_images.slider_id'
      )
    console.log('Joined Slider Data:', joinedSliderData)

    // Testimonials
    const testimonialsEnResults = await db('testimonials_en').select('*')
    console.log('testimonials_en:', testimonialsEnResults)

    const testimonialsPlResults = await db('testimonials_pl').select('*')
    console.log('testimonials_pl:', testimonialsPlResults)

    const blogPostsEnResults = await db('blog_posts_en').select('*')
    console.log('blog_posts_en:', blogPostsEnResults)

    const blogPostsPlResults = await db('blog_posts_pl').select('*')
    console.log('blog_posts_pl:', blogPostsPlResults)


    const bannersEnResults = await db('zirospace_banners_en').select('*')
    console.log('zirospace_banners_en:', bannersEnResults)

    const bannersPlResults = await db('zirospace_banners_pl').select('*')
    console.log('zirospace_banners_pl:', bannersPlResults)

    const servicesEnResults = await db('services_en').select('*')
    console.log('services_en:', servicesEnResults)

    const servicesPlResults = await db('services_pl').select('*')
    console.log('services_pl:', servicesPlResults)

    console.log('Error querying database:', error)
  } finally {
    knex.destroy()
  }
}

testQueries()

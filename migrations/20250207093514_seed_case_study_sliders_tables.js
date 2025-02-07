exports.up = async function(knex) {
  await knex('case_study_sliders').insert([
    { id: 'example-slider-en-1', theme: 'light' }
  ]);

  await knex('case_study_slider_images').insert([
    { id: 'example-slider-image-en-1', slider_id: 'example-slider-en-1', image: 'https://i.postimg.cc/3xwHPQmr/hf-01.png', alt: 'hf 01' },
    { id: 'example-slider-image-en-2', slider_id: 'example-slider-en-1', image: 'https://i.postimg.cc/jdtT47j7/hf-02.png', alt: 'hf 02' },
    { id: 'example-slider-image-en-3', slider_id: 'example-slider-en-1', image: 'https://i.postimg.cc/dt6YHV7S/hf-03.png', alt: 'hf 03' },
    { id: 'example-slider-image-en-4', slider_id: 'example-slider-en-1', image: 'https://i.postimg.cc/SQWq9rm4/hf-04.png', alt: 'hf 04' },
    { id: 'example-slider-image-en-5', slider_id: 'example-slider-en-1', image: 'https://i.postimg.cc/BnwG37BT/hf-05.png', alt: 'hf 05' },
  ]);
};

exports.down = async function(knex) {
  await knex('case_study_slider_images').where('slider_id', 'example-slider-en-1').del();
  await knex('case_study_sliders').where('id', 'example-slider-en-1').del();
};
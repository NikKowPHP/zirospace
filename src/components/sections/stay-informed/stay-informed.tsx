import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

export const StayInformed = async () => {
  const t = await getTranslations('stayInformedSection')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section
        className="flex flex-col   items-center text-center   py-[100px] "
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <div className="flex flex-col items-center text-center max-w-5xl gap-[10px] sm:gap-[12px]">
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-black"
            itemProp="headline"
          >
            {t('title')}
          </h1>
          <h3 className="text-[18px] sm:text-[20px] lg:text-[20px] text-gray-700 leading-[1.2] ">
            {t('subtitle')}
          </h3>
        </div>
        <div className="flex flex-col gap-[20px] max-w-[240px] w-full mt-[20px]">
          <Form t={t} />
        </div>
      </section>
    </Suspense>
  )
}

const Form = ({ t }: any) => {
  return (
    <form className="flex flex-col gap-[40px]  w-full">
      <div className="flex flex-col gap-[20px] w-full">
        <Input label={t('form.firstName')} placeholder="Jane" />
        <Input label={t('form.lastName')} placeholder="Doe" />
        <Input label={t('form.email')} placeholder="jane@doe.com" />
      </div>
      <button className="bg-primary text-white px-4 py-2 rounded-md">
        {t('form.submit')}
      </button>
    </form>
  )
}

const Input = ({ label, placeholder }: any) => {
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <label htmlFor={label} className="text-[12px] text-gray-500  ">
        {label}
      </label>
      <input
        type="text"
        className="border border-gray-200 bg-gray-100 text-[12px] p-[12px] py-[5px] rounded-md w-full"
        placeholder={placeholder}
      />
    </div>
  )
}

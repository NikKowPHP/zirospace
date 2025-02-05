export function CaseStudiesLoader() {
  return (
    <div className="container relative mx-auto lg:px-6 flex flex-col gap-16">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="animate-pulse bg-gray-200 rounded-lg h-[300px] w-full"
        />
      ))}
    </div>
  );
} 
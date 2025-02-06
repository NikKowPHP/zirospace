import { Suspense } from 'react'
import YouTube from 'react-youtube'

export const FloatVideo = async () => {
  const videoId = 'vKb9WcH8Qpg'

  const opts = {
    height: '150',
    width: '200',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      playlist: videoId, 
    },
  }

  return (
    <Suspense
      fallback={
        <div className="fixed bottom-[50px] right-5 min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section className="fixed bottom-[65px] right-[10px]"
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <div className="w-[200px] h-[150px] rounded-lg overflow-hidden">
          <YouTube
            videoId={videoId}
            opts={opts}
            className="w-full h-full"
          />
        </div>
      </section>
    </Suspense>
  )
}

import './App.css'
import MainScroll from './components/MainScroll'

function App() {
  return (
    <>
       <div className='container'>
       <video id="f400c859-2fa7-07ea-3afd-52145597a3e8-video" autoPlay 
       loop 
       style={{
        width:"100%",
        backgroundImage:"url(&quot;https://cdn.prod.website-files.com/68e62d82ad1369588a8cc935%2F68e7b08f5e140f986bb39830_podcastwebsite_hero_video%20%281440p%29%20%281%29-poster-00001.jpg&quot;)"}}
        muted playsInline data-wf-ignore="true" data-object-fit="cover">
          <source src="https://cdn.prod.website-files.com/68e62d82ad1369588a8cc935%2F68e7b08f5e140f986bb39830_podcastwebsite_hero_video%20%281440p%29%20%281%29-transcode.mp4" data-wf-ignore="true" />
          <source src="https://cdn.prod.website-files.com/68e62d82ad1369588a8cc935%2F68e7b08f5e140f986bb39830_podcastwebsite_hero_video%20%281440p%29%20%281%29-transcode.webm"
        data-wf-ignore="true" />
       </video>
       </div>
         <MainScroll />
       <div className='container'></div>
    </>
  )
}

export default App

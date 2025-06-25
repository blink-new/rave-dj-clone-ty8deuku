import { useState, useCallback, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import { Play, Pause, Search, Music, Headphones, Volume2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent } from './components/ui/card'
import { Progress } from './components/ui/progress'
import { Badge } from './components/ui/badge'
import { Slider } from './components/ui/slider'
import { toast } from 'react-hot-toast'
import { WaveformVisualizer } from './components/WaveformVisualizer'
import { FloatingParticles } from './components/FloatingParticles'

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/@Weird0radi0')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState([75])

  const extractVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      toast.success('YouTube video loaded!')
    } else {
      setVideoId(null);
    }
  };
  
  useEffect(() => {
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
    }
  }, [youtubeUrl]);


  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Rave.AI
                  </h1>
                  <p className="text-sm text-white/60">AI Music Mashup Studio</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-purple-400" />
                  Load a YouTube Video
                </h2>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    placeholder="Paste a YouTube URL to start..."
                    value={youtubeUrl}
                    onChange={handleUrlChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500"
                  />
                </div>
                
                {videoId ? (
                  <div className='space-y-6'>
                    <div className="aspect-video rounded-lg overflow-hidden shadow-2xl shadow-purple-500/20">
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        width="100%"
                        height="100%"
                        controls
                        playing={isPlaying}
                        onProgress={(p) => setProgress(p.played * 100)}
                        volume={volume[0] / 100}
                      />
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="space-y-3">
                        <WaveformVisualizer isPlaying={isPlaying} progress={progress} className="bg-white/5 backdrop-blur-sm" />
                        <Progress value={progress} className="h-1" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          onClick={togglePlayback}
                          size="lg"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-12 h-12"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </Button>
                        
                        <div className="flex items-center space-x-2 flex-1 ml-4">
                          <Volume2 className="w-4 h-4 text-white/60" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-12 text-white/40'>
                    <p>No valid YouTube video loaded.</p>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}

export default App
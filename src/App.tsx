<h1 className="text-2xl font-bold font-voltaire bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
  Rave.AI
</h1>

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
  const [youtubeUrl1, setYoutubeUrl1] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // Default URL 1
  const [videoId1, setVideoId1] = useState<string | null>(null)
  const [youtubeUrl2, setYoutubeUrl2] = useState('https://www.youtube.com/watch?v=3YxaaGgTQYM') // Default URL 2
  const [videoId2, setVideoId2] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress1, setProgress1] = useState(0)
  const [progress2, setProgress2] = useState(0)
  const [volume, setVolume] = useState([75])

  const extractVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl1(url);
    const id = extractVideoId(url);
    if (id) {
      setVideoId1(id);
      toast.success('YouTube video 1 loaded!')
    } else {
      setVideoId1(null);
    }
  };

  const handleUrlChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl2(url);
    const id = extractVideoId(url);
    if (id) {
      setVideoId2(id);
      toast.success('YouTube video 2 loaded!')
    } else {
      setVideoId2(null);
    }
  };
  
  useEffect(() => {
    const id1 = extractVideoId(youtubeUrl1);
    if (id1) {
      setVideoId1(id1);
    }
    const id2 = extractVideoId(youtubeUrl2);
    if (id2) {
      setVideoId2(id2);
    }
  }, [youtubeUrl1, youtubeUrl2]);

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
                  <h1 className="text-2xl font-bold font-voltaire bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* YouTube Player 1 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2 text-purple-400" />
                YouTube Video 1
              </h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Paste YouTube URL..."
                  value={youtubeUrl1}
                  onChange={handleUrlChange1}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500"
                />
              </div>
              
              {videoId1 ? (
                <div className='space-y-6'>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl shadow-purple-500/20">
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${videoId1}`}
                      width="100%"
                      height="100%"
                      controls
                      playing={isPlaying}
                      onProgress={(p) => setProgress1(p.played * 100)}
                      volume={volume[0] / 100}
                    />
                  </div>

                  <div className="space-y-3">
                    <WaveformVisualizer isPlaying={isPlaying} progress={progress1} className="bg-white/5 backdrop-blur-sm" />
                    <Progress value={progress1} className="h-1" />
                  </div>
                </div>
              ) : (
                <div className='text-center py-12 text-white/40'>
                  <p>No video loaded.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* YouTube Player 2 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2 text-pink-400" />
                YouTube Video 2
              </h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Paste YouTube URL..."
                  value={youtubeUrl2}
                  onChange={handleUrlChange2}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500"
                />
              </div>
              
              {videoId2 ? (
                <div className='space-y-6'>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl shadow-pink-500/20">
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${videoId2}`}
                      width="100%"
                      height="100%"
                      controls
                      playing={isPlaying}
                      onProgress={(p) => setProgress2(p.played * 100)}
                      volume={volume[0] / 100}
                    />
                  </div>

                  <div className="space-y-3">
                    <WaveformVisualizer isPlaying={isPlaying} progress={progress2} className="bg-white/5 backdrop-blur-sm" />
                    <Progress value={progress2} className="h-1" />
                  </div>
                </div>
              ) : (
                <div className='text-center py-12 text-white/40'>
                  <p>No video loaded.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Global Controls */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md mt-8">
          <CardContent className="p-6 flex items-center justify-between">
            <Button
              onClick={togglePlayback}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-14 h-14 flex-shrink-0"
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </Button>
            
            <div className="flex items-center space-x-4 flex-1 ml-6">
              <Volume2 className="w-5 h-5 text-white/60" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
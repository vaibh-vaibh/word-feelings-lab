import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import SentiRobot from '@/components/SentiRobot';
import SentimentDisplay from '@/components/SentimentDisplay';
import { analyzeSentiment, getFunFact, getRandomWords, SentimentResult } from '@/utils/sentiment';

export default function Playground() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);

  // Analyze sentiment with a small delay for better UX
  useEffect(() => {
    if (inputText.trim()) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const analysis = analyzeSentiment(inputText);
        setResult(analysis);
        setIsAnalyzing(false);
        setShowFunFact(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResult(null);
      setIsAnalyzing(false);
      setShowFunFact(false);
    }
  }, [inputText]);

  const handleExampleClick = (text: string) => {
    setInputText(text);
  };

  const generateRandomExample = (sentiment: 'positive' | 'negative' | 'neutral') => {
    const words = getRandomWords(sentiment, 3);
    const exampleSentences = {
      positive: [
        `I feel ${words[0]} and ${words[1]} today!`,
        `This is ${words[0]}! I ${words[1]} it so much!`,
        `What a ${words[0]} and ${words[1]} day!`
      ],
      negative: [
        `I feel ${words[0]} and ${words[1]} right now.`,
        `This makes me ${words[0]} and ${words[1]}.`,
        `I'm feeling ${words[0]} today.`
      ],
      neutral: [
        `This seems ${words[0]} and ${words[1]}.`,
        `I think this is pretty ${words[0]}.`,
        `Everything looks ${words[0]} today.`
      ]
    };
    return exampleSentences[sentiment][Math.floor(Math.random() * exampleSentences[sentiment].length)];
  };

  const examples = [
    { text: "I love playing with my friends!", sentiment: 'positive' as const },
    { text: "This ice cream is absolutely amazing!", sentiment: 'positive' as const },
    { text: "I hate doing homework on weekends.", sentiment: 'negative' as const },
    { text: "This movie is boring and stupid.", sentiment: 'negative' as const },
    { text: "The weather is okay today.", sentiment: 'neutral' as const },
    { text: "I walked to school this morning.", sentiment: 'neutral' as const }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Word Feelings Playground 🎮
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Type anything and watch Senti analyze the feelings in your words!
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="card-lab">
              <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                ✍️ Write Your Words
              </h2>
              <Textarea
                placeholder="Type something here and I'll tell you how it feels! Try 'I love chocolate cake' or 'This is boring'..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] text-lg rounded-2xl border-2 focus:border-primary transition-colors"
              />
              <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <span>{inputText.length} characters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputText('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear ✨
                </Button>
              </div>
            </Card>

            {/* Example Buttons */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">
                🎯 Try These Examples:
              </h3>
              <div className="grid gap-3">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleExampleClick(example.text)}
                    className={`text-left justify-start p-4 h-auto rounded-xl transition-all hover:scale-105 ${
                      example.sentiment === 'positive' ? 'hover:bg-positive/10 hover:border-positive' :
                      example.sentiment === 'negative' ? 'hover:bg-negative/10 hover:border-negative' :
                      'hover:bg-neutral/10 hover:border-neutral'
                    }`}
                  >
                    <div className="text-sm">{example.text}</div>
                  </Button>
                ))}
              </div>
              
              {/* Random Example Generator */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Or generate random examples:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleExampleClick(generateRandomExample('positive'))}
                    className="btn-positive text-xs"
                  >
                    😊 Happy Words
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleExampleClick(generateRandomExample('negative'))}
                    className="btn-negative text-xs"
                  >
                    😢 Sad Words
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleExampleClick(generateRandomExample('neutral'))}
                    className="btn-neutral text-xs"
                  >
                    😐 Neutral Words
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Senti Robot */}
            <div className="text-center">
              <SentiRobot
                mood={isAnalyzing ? 'thinking' : result ? result.sentiment as any : 'happy'}
                message={
                  isAnalyzing ? "Let me think about this... 🤔" :
                  result ? "Here's what I found!" :
                  "I'm ready to analyze your words! ✨"
                }
                size="large"
                animate={true}
              />
            </div>

            {/* Analysis Results */}
            {isAnalyzing && (
              <Card className="card-lab text-center">
                <div className="animate-pulse">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-muted-foreground">Analyzing word feelings...</p>
                </div>
              </Card>
            )}

            {result && !isAnalyzing && (
              <div className="space-y-4">
                <SentimentDisplay result={result} showDetails={true} />
                
                {/* Fun Fact Section */}
                <Card className="card-lab">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-foreground">🧠 Fun Fact!</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowFunFact(!showFunFact)}
                      className="text-primary"
                    >
                      {showFunFact ? 'Hide' : 'Show'} 🎭
                    </Button>
                  </div>
                  {showFunFact && (
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">
                        {getFunFact(result.sentiment)}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Empty State */}
            {!result && !isAnalyzing && (
              <Card className="card-lab text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Ready to Start!</h3>
                <p className="text-muted-foreground">
                  Type some words above and I'll analyze their feelings for you!
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="card-lab mt-12">
          <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
            💡 Pro Tips for Word Detectives:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <strong className="text-positive">✅ Happy words</strong> like "love", "awesome", "great" make sentences positive!
              </p>
              <p className="text-muted-foreground">
                <strong className="text-negative">❌ Sad words</strong> like "hate", "terrible", "awful" make sentences negative!
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <strong className="text-neutral">➖ Neutral words</strong> like "okay", "normal", "fine" don't show strong feelings.
              </p>
              <p className="text-muted-foreground">
                <strong className="text-primary">🔬 Mix them up</strong> and see how the overall feeling changes!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
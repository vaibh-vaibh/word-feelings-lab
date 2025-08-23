import { SentimentResult } from '@/utils/sentiment';
import { Progress } from '@/components/ui/progress';

interface SentimentDisplayProps {
  result: SentimentResult;
  showDetails?: boolean;
}

export default function SentimentDisplay({ result, showDetails = true }: SentimentDisplayProps) {
  const getSentimentClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'sentiment-positive';
      case 'negative':
        return 'sentiment-negative';
      default:
        return 'sentiment-neutral';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '🌟';
      case 'negative':
        return '💙';
      default:
        return '😌';
    }
  };

  const getSentimentTitle = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Positive Feelings! ';
      case 'negative':
        return 'Negative Feelings ';
      default:
        return 'Neutral Feelings ';
    }
  };

  return (
    <div className={`${getSentimentClass(result.sentiment)} max-w-md mx-auto`}>
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{result.emoji}</div>
        <h3 className="text-xl font-bold mb-2">
          {getSentimentIcon(result.sentiment)} {getSentimentTitle(result.sentiment)}
        </h3>
        <p className="text-sm opacity-90">{result.message}</p>
      </div>

      {showDetails && (
        <div className="space-y-4">
          {/* Confidence meter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-sm font-bold">{result.confidence}%</span>
            </div>
            <Progress 
              value={result.confidence} 
              className="h-3 bg-white/30"
            />
          </div>

          {/* Matched words */}
          {result.matchedWords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Words that gave it away:</h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedWords.map((word, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium border border-white/30"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Score display */}
          <div className="text-center pt-2 border-t border-white/20">
            <span className="text-xs opacity-75">
              Found {result.score} {result.sentiment} word{result.score !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
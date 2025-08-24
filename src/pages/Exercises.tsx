import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SentiRobot from '@/components/SentiRobot';
import { getRandomWords, analyzeSentiment } from '@/utils/sentiment';
import { toast } from '@/hooks/use-toast';

type WordItem = {
  word: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  id: string;
};

export default function Exercises() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [draggedWord, setDraggedWord] = useState<WordItem | null>(null);
  const [gameWords, setGameWords] = useState<WordItem[]>([]);
  const [sortedWords, setSortedWords] = useState<{
    positive: WordItem[];
    negative: WordItem[];
    neutral: WordItem[];
  }>({
    positive: [],
    negative: [],
    neutral: []
  });

  // Exercise 2 state (Sentence Building)
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [customSentence, setCustomSentence] = useState('');
  const [availableWords, setAvailableWords] = useState<{
    subjects: string[];
    verbs: string[];
    adjectives: string[];
    objects: string[];
  }>({
    subjects: [],
    verbs: [],
    adjectives: [],
    objects: []
  });
  
  // Exercise 3 state (Feeling Finder)
  const [currentSentence, setCurrentSentence] = useState('');
  const [sentenceWords3, setSentenceWords3] = useState<Array<{word: string, isSentiment: boolean, clicked: boolean}>>([]);
  const [foundWords, setFoundWords] = useState(0);

  const exercises = [
    {
      title: "Word Sorting Challenge 🎯",
      description: "Drag and drop words into the correct feeling boxes!",
      type: "sorting"
    },
    {
      title: "Sentence Building 🔧",
      description: "Build sentences with different feelings!",
      type: "building"
    },
    {
      title: "Feeling Finder 🔍",  
      description: "Find the feeling words in sentences!",
      type: "finding"
    }
  ];

  const currentExerciseData = exercises[currentExercise];

  // Initialize word sorting game
  const initializeSortingGame = useCallback(() => {
    const positiveWords = getRandomWords('positive', 3);
    const negativeWords = getRandomWords('negative', 3);
    const neutralWords = getRandomWords('neutral', 2);
    
    const allWords: WordItem[] = [
      ...positiveWords.map(word => ({ word, sentiment: 'positive' as const, id: `pos-${word}` })),
      ...negativeWords.map(word => ({ word, sentiment: 'negative' as const, id: `neg-${word}` })),
      ...neutralWords.map(word => ({ word, sentiment: 'neutral' as const, id: `neu-${word}` }))
    ];

    // Shuffle the words
    const shuffledWords = allWords.sort(() => Math.random() - 0.5);
    setGameWords(shuffledWords);
    setSortedWords({ positive: [], negative: [], neutral: [] });
  }, []);

  // Initialize sentence building game
  const initializeSentenceGame = useCallback(() => {
    const subjects = ['I', 'My friend', 'The teacher', 'My dog', 'We'];
    const verbs = ['feel', 'am', 'look', 'seem', 'appear'];
    const adjectives = getRandomWords('positive', 3).concat(getRandomWords('negative', 3)).concat(getRandomWords('neutral', 2));
    const objects = ['today', 'right now', 'about this', 'every day', 'sometimes'];

    setAvailableWords({
      subjects: subjects.sort(() => Math.random() - 0.5),
      verbs: verbs.sort(() => Math.random() - 0.5),
      adjectives: adjectives.sort(() => Math.random() - 0.5),
      objects: objects.sort(() => Math.random() - 0.5)
    });
    setSentenceWords([]);
  }, []);

  // Initialize feeling finder game
  const initializeFeelingGame = useCallback(() => {
    const sentences = [
      "I am extremely happy about my birthday party!",
      "The movie was absolutely terrible and boring.",
      "She feels wonderful after winning the competition.",
      "He looked very sad when his team lost.",
      "The weather is nice today for a walk.",
      "I'm so excited about our school trip tomorrow!",
      "The food tastes amazing at this restaurant.",
      "She was disappointed with her test results."
    ];
    
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(randomSentence);
    
    // Mark sentiment words
    const words = randomSentence.split(' ').map(word => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
      const sentiment = analyzeSentiment(cleanWord);
      return {
        word,
        isSentiment: sentiment.sentiment !== 'neutral',
        clicked: false
      };
    });
    
    setSentenceWords3(words);
    setFoundWords(0);
  }, []);

  // Initialize the first exercise
  useState(() => {
    initializeSortingGame();
  });

  const handleDragStart = (word: WordItem) => {
    setDraggedWord(word);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSentiment: 'positive' | 'negative' | 'neutral') => {
    e.preventDefault();
    
    if (!draggedWord) return;

    // Remove word from game words
    setGameWords(prev => prev.filter(w => w.id !== draggedWord.id));
    
    // Add word to the target category
    setSortedWords(prev => ({
      ...prev,
      [targetSentiment]: [...prev[targetSentiment], draggedWord]
    }));

    // Check if correct
    if (draggedWord.sentiment === targetSentiment) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: `"${draggedWord.word}" is indeed ${targetSentiment}!`,
      });
    } else {
      toast({
        title: "Not quite right! 🤔",
        description: `"${draggedWord.word}" is actually ${draggedWord.sentiment}, not ${targetSentiment}.`,
        variant: "destructive"
      });
    }

    setDraggedWord(null);
  };

  const resetGame = () => {
    initializeSortingGame();
    setScore(0);
  };

  // Exercise 2 handlers (Sentence Building)
  const addWordToSentence = (word: string) => {
    setSentenceWords(prev => [...prev, word]);
  };

  const removeWordFromSentence = (index: number) => {
    setSentenceWords(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeSentence = () => {
    const sentence = sentenceWords.join(' ');
    const result = analyzeSentiment(sentence);
    
    toast({
      title: `${result.emoji} ${result.sentiment.toUpperCase()} Sentence!`,
      description: result.message,
    });

    setScore(prev => prev + 15);
  };

  const resetSentence = () => {
    setSentenceWords([]);
    setCustomSentence('');
    initializeSentenceGame();
  };

  const analyzeCustomSentence = () => {
    if (!customSentence.trim()) {
      toast({
        title: "Empty sentence! 🤔",
        description: "Please write a sentence first, then I can analyze it!",
        variant: "destructive"
      });
      return;
    }

    const result = analyzeSentiment(customSentence);
    toast({
      title: `${result.emoji} ${result.sentiment.toUpperCase()} Sentence!`,
      description: result.message,
    });

    setScore(prev => prev + 20); 
  };

  // Exercise 3 handlers (Feeling Finder)
  const handleWordClick = (index: number) => {
    const word = sentenceWords3[index];
    if (word.clicked) return;

    const newWords = [...sentenceWords3];
    newWords[index] = { ...word, clicked: true };
    setSentenceWords3(newWords);

    if (word.isSentiment) {
      setScore(prev => prev + 10);
      setFoundWords(prev => prev + 1);
      toast({
        title: "Great find! 🎉",
        description: `"${word.word.replace(/[^\w]/g, '')}" is indeed a feeling word!`,
      });
    } else {
      toast({
        title: "Not quite! 🤔",
        description: `"${word.word.replace(/[^\w]/g, '')}" doesn't really show strong feelings.`,
        variant: "destructive"
      });
    }
  };

  const resetFeelingGame = () => {
    initializeFeelingGame();
    setScore(prev => Math.max(0, prev - 20)); 
  };

  const renderSortingExercise = () => (
    <div className="space-y-6">
      {/* Score and Reset */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold text-foreground">
            Score: {score} points 🌟
          </div>
          <Button onClick={resetGame} variant="outline" size="sm" className="rounded-full">
            Reset Game 🔄
          </Button>
        </div>
      </div>

      {/* Words to Sort */}
      <Card className="card-lab">
        <h3 className="text-lg font-bold mb-4 text-foreground">
          📝 Drag these words to the right boxes:
        </h3>
        <div className="flex flex-wrap gap-3 min-h-[60px] p-4 bg-muted/30 rounded-xl">
          {gameWords.map((word) => (
            <div
              key={word.id}
              draggable
              onDragStart={() => handleDragStart(word)}
              className="px-4 py-2 bg-white rounded-full shadow-md cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/50 hover:border-primary transition-all hover:scale-105"
            >
              {word.word}
            </div>
          ))}
          {gameWords.length === 0 && (
            <p className="text-muted-foreground text-center w-full py-4">
              Great job! All words have been sorted! 🎉
            </p>
          )}
        </div>
      </Card>

      {/* Drop Zones */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Positive Box */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'positive')}
          className="sentiment-positive min-h-[150px] flex flex-col"
        >
          <h4 className="text-lg font-bold mb-3 text-center">😊 Happy Words</h4>
          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {sortedWords.positive.map((word) => (
              <span
                key={word.id}
                className="px-3 py-1 bg-white/20 rounded-full text-sm border border-white/30"
              >
                {word.word}
              </span>
            ))}
          </div>
        </div>

        {/* Negative Box */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'negative')}
          className="sentiment-negative min-h-[150px] flex flex-col"
        >
          <h4 className="text-lg font-bold mb-3 text-center">😢 Sad Words</h4>
          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {sortedWords.negative.map((word) => (
              <span
                key={word.id}
                className="px-3 py-1 bg-white/20 rounded-full text-sm border border-white/30"
              >
                {word.word}
              </span>
            ))}
          </div>
        </div>

        {/* Neutral Box */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'neutral')}
          className="sentiment-neutral min-h-[150px] flex flex-col"
        >
          <h4 className="text-lg font-bold mb-3 text-center">😐 Neutral Words</h4>
          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {sortedWords.neutral.map((word) => (
              <span
                key={word.id}
                className="px-3 py-1 bg-white/20 rounded-full text-sm border border-white/30"
              >
                {word.word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <Card className="card-lab bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-bold text-foreground mb-2">How to Play:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Drag words from the gray box above</li>
              <li>• Drop them into the correct feeling box</li>
              <li>• Get 10 points for each correct placement!</li>
              <li>• Try to sort all the words correctly</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSentenceExercise = () => (
    <div className="space-y-6">
      {/* Score and Reset */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold text-foreground">
            Score: {score} points 🌟
          </div>
          <Button onClick={resetSentence} variant="outline" size="sm" className="rounded-full">
            Reset Sentence 🔄
          </Button>
        </div>
      </div>

      {/* Current Sentence */}
      <Card className="card-lab">
        <h3 className="text-lg font-bold mb-4 text-foreground">
          📝 Your Sentence:
        </h3>
        <div className="min-h-[60px] p-4 bg-muted/30 rounded-xl border-2 border-dashed border-primary/30">
          {sentenceWords.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {sentenceWords.map((word, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeWordFromSentence(index)}
                >
                  {word} ✕
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center w-full py-4">
              Click words below to build your sentence! 👇
            </p>
          )}
        </div>
        {sentenceWords.length > 0 && (
          <div className="mt-4 flex gap-2">
            <Button onClick={analyzeSentence} className="flex-1">
              Analyze My Sentence! 🔍
            </Button>
          </div>
        )}
      </Card>

      {/* Custom Sentence Input */}
      <Card className="card-lab">
        <h3 className="text-lg font-bold mb-4 text-foreground">
          ✏️ Or Write Your Own Sentence:
        </h3>
        <div className="space-y-4">
          <textarea
            value={customSentence}
            onChange={(e) => setCustomSentence(e.target.value)}
            placeholder="Type your own sentence here... How are you feeling today?"
            className="w-full p-4 rounded-xl border-2 border-primary/30 bg-muted/30 resize-none focus:border-primary focus:outline-none"
            rows={3}
          />
          <Button 
            onClick={analyzeCustomSentence} 
            className="w-full"
            disabled={!customSentence.trim()}
          >
            Analyze My Own Sentence! 🔍 (20 points)
          </Button>
        </div>
      </Card>

      {/* Word Categories */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 grid-cols-1 xs:grid-cols-2">
        {/* Subjects */}
        <Card className="card-lab">
          <h4 className="font-bold text-foreground mb-3">👤 Who/What:</h4>
          <div className="space-y-2">
            {availableWords.subjects.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => addWordToSentence(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </Card>

        {/* Verbs */}
        <Card className="card-lab">
          <h4 className="font-bold text-foreground mb-3">⚡ Action:</h4>
          <div className="space-y-2">
            {availableWords.verbs.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => addWordToSentence(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </Card>

        {/* Adjectives */}
        <Card className="card-lab">
          <h4 className="font-bold text-foreground mb-3">🎨 Feeling:</h4>
          <div className="space-y-2">
            {availableWords.adjectives.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => addWordToSentence(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </Card>

        {/* Objects */}
        <Card className="card-lab">
          <h4 className="font-bold text-foreground mb-3">📅 When/What:</h4>
          <div className="space-y-2">
            {availableWords.objects.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => addWordToSentence(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="card-lab bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-bold text-foreground mb-2">How to Play:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click words from the categories to build a sentence</li>
              <li>• Click the ✕ on words in your sentence to remove them</li>
              <li>• Once you have a sentence, click "Analyze" to see its feeling!</li>
              <li>• Get 15 points each time you analyze a sentence!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFeelingExercise = () => (
    <div className="space-y-6">
      {/* Score and Reset */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold text-foreground">
            Score: {score} points 🌟
          </div>
          <Button onClick={resetFeelingGame} variant="outline" size="sm" className="rounded-full">
            New Sentence 🔄
          </Button>
        </div>
      </div>

      {/* Sentence to Analyze */}
      <Card className="card-lab">
        <h3 className="text-lg font-bold mb-4 text-foreground">
          🔍 Find the feeling words in this sentence:
        </h3>
        <div className="p-4 bg-muted/30 rounded-xl">
          <div className="text-lg leading-relaxed flex flex-wrap gap-2">
            {sentenceWords3.map((wordObj, index) => (
              <span
                key={index}
                onClick={() => handleWordClick(index)}
                className={`cursor-pointer px-1 py-1 rounded transition-all ${
                  wordObj.clicked
                    ? wordObj.isSentiment
                      ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                      : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                    : 'hover:bg-primary/20'
                }`}
              >
                {wordObj.word}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="card-lab">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Feeling words found:</span>
          <span className="font-bold text-primary">
            {foundWords} / {sentenceWords3.filter(w => w.isSentiment).length}
          </span>
        </div>
        {foundWords === sentenceWords3.filter(w => w.isSentiment).length && foundWords > 0 && (
          <p className="text-green-600 dark:text-green-400 text-center mt-2 font-bold">
            🎉 Great job! You found all the feeling words!
          </p>
        )}
      </Card>

      {/* Instructions */}
      <Card className="card-lab bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-bold text-foreground mb-2">How to Play:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click on words that show strong feelings or emotions</li>
              <li>• Green = Correct feeling word! 🎉</li>
              <li>• Red = Not a feeling word 😅</li>
              <li>• Get 10 points for each correct word you find!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Word Feelings Exercises 🎯
          </h1>
          <p className="text-xl text-muted-foreground">
            Practice your sentiment analysis skills with fun interactive games!
          </p>
        </div>

        {/* Exercise Navigation */}
        <Card className="card-lab mb-8">
          <div className="flex justify-center">
            <div className="flex rounded-full p-1 bg-muted">
              {exercises.map((exercise, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setCurrentExercise(index);
                    if (index === 0) initializeSortingGame();
                    if (index === 1) initializeSentenceGame();
                    if (index === 2) initializeFeelingGame();
                  }}
                  variant={currentExercise === index ? "default" : "ghost"}
                  className={`rounded-full ${
                    currentExercise === index 
                      ? 'bg-primary text-primary-foreground' 
                      : ''
                  }`}
                >
                  Exercise {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Main Exercise Area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Exercise Content */}
          <div className="lg:col-span-3">
            <Card className="card-lab">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-foreground">
                  {currentExerciseData.title}
                </h2>
                <p className="text-muted-foreground">
                  {currentExerciseData.description}
                </p>
              </div>

              {currentExercise === 0 && renderSortingExercise()}
              {currentExercise === 1 && renderSentenceExercise()}
              {currentExercise === 2 && renderFeelingExercise()}
            </Card>
          </div>

          {/* Senti Sidebar */}
          <div className="space-y-6">
            <Card className="card-lab text-center">
              <SentiRobot
                mood="happy"
                message={
                  score > 50 ? "You're doing amazing! Keep it up! 🌟" :
                  score > 20 ? "Great job! You're learning fast! 😊" :
                  "Let's practice together! You've got this! 💪"
                }
                size="medium"
                animate={true}
              />
            </Card>

            {/* Stats */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">
                📊 Your Stats:
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Score:</span>
                  <span className="font-bold text-primary">{score} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words Sorted:</span>
                  <span className="font-bold text-foreground">
                    {sortedWords.positive.length + sortedWords.negative.length + sortedWords.neutral.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-bold text-foreground">{gameWords.length}</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">
                💡 Tips:
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Think about how each word makes you feel</p>
                <p>• Happy words = Positive 😊</p>
                <p>• Sad/angry words = Negative 😢</p>
                <p>• Ordinary words = Neutral 😐</p>
                <p>• Take your time - there's no rush!</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
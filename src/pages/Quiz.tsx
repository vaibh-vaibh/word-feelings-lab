import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import SentiRobot from '@/components/SentiRobot';
import SentimentDisplay from '@/components/SentimentDisplay';
import { analyzeSentiment } from '@/utils/sentiment';
import { Link } from 'react-router-dom';

interface QuizQuestion {
  id: number;
  sentence: string;
  correctAnswer: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    sentence: "I absolutely love playing soccer with my friends!",
    correctAnswer: 'positive',
    explanation: "Words like 'absolutely love' show very strong positive feelings!"
  },
  {
    id: 2,
    sentence: "This homework is so boring and stupid.",
    correctAnswer: 'negative',
    explanation: "Words like 'boring' and 'stupid' express negative feelings about the homework."
  },
  {
    id: 3,
    sentence: "I walked to the store this morning.",
    correctAnswer: 'neutral',
    explanation: "This sentence just states a fact without showing strong emotions either way."
  },
  {
    id: 4,
    sentence: "I'm terrified of spiders and hate when they're in my room!",
    correctAnswer: 'negative',
    explanation: "'Terrified' and 'hate' are strong negative emotion words."
  },
  {
    id: 5,
    sentence: "The weather today is okay, not too hot or cold.",
    correctAnswer: 'neutral',
    explanation: "'Okay' is a neutral word that doesn't show strong feelings either way."
  },
  {
    id: 6,
    sentence: "This ice cream is amazing and makes me so happy!",
    correctAnswer: 'positive',
    explanation: "'Amazing' and 'happy' are clear positive emotion words!"
  },
  {
    id: 7,
    sentence: "I feel sad and disappointed about missing the party.",
    correctAnswer: 'negative',
    explanation: "'Sad' and 'disappointed' directly express negative emotions."
  },
  {
    id: 8,
    sentence: "The movie was fantastic and I had a wonderful time!",
    correctAnswer: 'positive',
    explanation: "'Fantastic' and 'wonderful' show very positive feelings about the experience."
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'positive' | 'negative' | 'neutral' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(quizQuestions.length).fill(false));
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQuestionData = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (answer: 'positive' | 'negative' | 'neutral') => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    setShowResult(true);
    
    if (selectedAnswer === currentQuestionData.correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Mark this question as answered
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(quizQuestions.length).fill(false));
    setIsQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "Amazing! You're a Word Feelings Expert! 🌟";
    if (percentage >= 60) return "Great job! You understand sentiment analysis well! 😊";
    if (percentage >= 40) return "Good start! Keep practicing to improve! 💪";
    return "Keep learning! You'll get better with more practice! 🤗";
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'btn-positive';
      case 'negative': return 'btn-negative';
      default: return 'btn-neutral';
    }
  };

  if (isQuizComplete) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="card-lab text-center">
            <div className="text-6xl mb-6">
              {score >= quizQuestions.length * 0.8 ? '🏆' : score >= quizQuestions.length * 0.6 ? '🎉' : '🌱'}
            </div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Quiz Complete!
            </h1>
            <div className="mb-6">
              <SentiRobot
                mood={score >= quizQuestions.length * 0.6 ? 'happy' : 'thinking'}
                message={getScoreMessage()}
                size="large"
                animate={true}
              />
            </div>
            
            <div className="bg-muted/30 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Your Results</h2>
              <div className="text-4xl font-black mb-2 text-primary">
                {score} / {quizQuestions.length}
              </div>
              <p className="text-muted-foreground mb-4">
                You got {Math.round((score / quizQuestions.length) * 100)}% correct!
              </p>
              <Progress value={(score / quizQuestions.length) * 100} className="h-4" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetQuiz} className="btn-magic">
                Try Again 🔄
              </Button>
              <Link to="/playground">
                <Button variant="outline" className="rounded-full">
                  Practice More 🎮
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="rounded-full">
                  Back to Home 🏠
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const analysisResult = analyzeSentiment(currentQuestionData.sentence);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Word Feelings Quiz 🏆
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your sentiment analysis skills with these questions!
          </p>
        </div>

        {/* Progress */}
        <Card className="card-lab mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-foreground">Quiz Progress</h3>
            <span className="text-sm font-medium text-primary">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Score: {score} / {currentQuestion + (showResult ? 1 : 0)}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-lab">
              <h2 className="text-xl font-bold mb-6 text-foreground">
                How does this sentence feel?
              </h2>
              
              <div className="bg-muted/30 rounded-2xl p-6 mb-6">
                <p className="text-lg font-medium text-center text-foreground">
                  "{currentQuestionData.sentence}"
                </p>
              </div>

              {!showResult ? (
                <>
                  <div className="grid gap-4 mb-6">
                    <Button
                      onClick={() => handleAnswerSelect('positive')}
                      variant={selectedAnswer === 'positive' ? 'default' : 'outline'}
                      className={`${getSentimentColor('positive')} p-6 text-left justify-start h-auto ${
                        selectedAnswer === 'positive' ? 'ring-2 ring-positive' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">😊</span>
                          <span className="font-bold">Positive</span>
                        </div>
                        <div className="text-sm opacity-90">Happy, good, excited feelings</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleAnswerSelect('negative')}
                      variant={selectedAnswer === 'negative' ? 'default' : 'outline'}
                      className={`${getSentimentColor('negative')} p-6 text-left justify-start h-auto ${
                        selectedAnswer === 'negative' ? 'ring-2 ring-negative' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">😢</span>
                          <span className="font-bold">Negative</span>
                        </div>
                        <div className="text-sm opacity-90">Sad, angry, upset feelings</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleAnswerSelect('neutral')}
                      variant={selectedAnswer === 'neutral' ? 'default' : 'outline'}
                      className={`${getSentimentColor('neutral')} p-6 text-left justify-start h-auto ${
                        selectedAnswer === 'neutral' ? 'ring-2 ring-neutral' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">😐</span>
                          <span className="font-bold">Neutral</span>
                        </div>
                        <div className="text-sm opacity-90">Calm, factual, no strong feelings</div>
                      </div>
                    </Button>
                  </div>

                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="w-full btn-magic text-lg py-3"
                  >
                    Submit Answer ✨
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Result */}
                  <div className={`rounded-2xl p-6 text-center ${
                    selectedAnswer === currentQuestionData.correctAnswer 
                      ? 'bg-positive/20 border-2 border-positive text-positive-foreground' 
                      : 'bg-negative/20 border-2 border-negative text-negative-foreground'
                  }`}>
                    <div className="text-4xl mb-2">
                      {selectedAnswer === currentQuestionData.correctAnswer ? '✅' : '❌'}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {selectedAnswer === currentQuestionData.correctAnswer ? 'Correct!' : 'Not Quite Right'}
                    </h3>
                    <p className="text-sm">
                      The correct answer is <strong>{currentQuestionData.correctAnswer}</strong>
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="bg-muted/30 rounded-2xl p-6">
                    <h4 className="font-bold mb-2 text-foreground">💡 Explanation:</h4>
                    <p className="text-muted-foreground mb-4">
                      {currentQuestionData.explanation}
                    </p>
                    
                    {/* Senti's Analysis */}
                    <div className="pt-4 border-t border-border">
                      <h5 className="font-bold mb-3 text-foreground">Senti's Analysis:</h5>
                      <SentimentDisplay result={analysisResult} showDetails={false} />
                    </div>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    className="w-full btn-magic text-lg py-3"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz! 🏆'}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="card-lab text-center">
              <SentiRobot
                mood={showResult 
                  ? (selectedAnswer === currentQuestionData.correctAnswer ? 'happy' : 'sad')
                  : 'thinking'
                }
                message={
                  showResult 
                    ? (selectedAnswer === currentQuestionData.correctAnswer 
                        ? "Great job! You got it right! 🌟" 
                        : "That's okay! We learn from mistakes! 💙")
                    : "Take your time and think about the feelings in the words! 🤔"
                }
                size="medium"
                animate={true}
              />
            </Card>

            {/* Question Navigator */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">Questions:</h3>
              <div className="grid grid-cols-4 gap-2">
                {quizQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === currentQuestion 
                        ? 'bg-primary text-primary-foreground' 
                        : answeredQuestions[index]
                        ? 'bg-positive text-positive-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">
                💡 Quiz Tips:
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Look for emotion words like "love", "hate", "okay"</p>
                <p>• Consider the overall feeling of the sentence</p>
                <p>• Strong emotion words usually make the whole sentence emotional</p>
                <p>• Take your time - there's no rush!</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
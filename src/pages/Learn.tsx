import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import SentiRobot from '@/components/SentiRobot';
import SentimentDisplay from '@/components/SentimentDisplay';
import { analyzeSentiment } from '@/utils/sentiment';
import { Link } from 'react-router-dom';

export default function Learn() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showExample, setShowExample] = useState(false);

  const lessons = [
    {
      title: "What is Sentiment Analysis? 🤔",
      content: "Sentiment Analysis is like being a detective for feelings! We look at words and sentences to figure out if they show happy feelings (positive), sad feelings (negative), or just normal feelings (neutral).",
      example: "I love sunny days!",
      robotMood: 'thinking' as const,
      robotMessage: "Think of it like this: words have secret feelings hidden inside them, and I can help you find them!"
    },
    {
      title: "Happy Words (Positive) 😊",
      content: "Positive words make us feel good! They show happiness, excitement, love, and other good feelings. When a sentence has more positive words, the whole sentence feels positive!",
      example: "This pizza is amazing and delicious!",
      robotMood: 'happy' as const,
      robotMessage: "I feel so happy when I see positive words! They're like sunshine for my robot brain!"
    },
    {
      title: "Sad Words (Negative) 😢",
      content: "Negative words express sadness, anger, disappointment, or other difficult feelings. It's important to recognize these too - they help us understand when someone might need help or comfort.",
      example: "I hate this boring homework.",
      robotMood: 'sad' as const,
      robotMessage: "Even sad words are important! They help us understand difficult feelings and be kind to others."
    },
    {
      title: "Neutral Words 😐",
      content: "Neutral words don't show strong feelings either way. They're calm, factual, or just ordinary. Sentences with mostly neutral words feel balanced and steady.",
      example: "I walked to school today.",
      robotMood: 'neutral' as const,
      robotMessage: "Neutral words are like the calm between storms - they give our emotions a peaceful rest!"
    },
    {
      title: "How Do We Decide? 🔍",
      content: "To analyze sentiment, we count the feeling words in a sentence. If there are more positive words than negative ones, the sentence is positive! If there are more negative words, it's negative. If they're equal or there aren't many feeling words, it's neutral.",
      example: "I love ice cream but I hate vegetables.",
      robotMood: 'thinking' as const,
      robotMessage: "This sentence has both love (positive) and hate (negative)! Let's see which feeling wins!"
    },
    {
      title: "Why Is This Useful? 🌟",
      content: "Sentiment analysis helps computers understand human emotions! It's used in social media, customer reviews, chatbots, and even to help make websites and apps better for people like you!",
      example: "This app is so cool and fun to use!",
      robotMood: 'happy' as const,
      robotMessage: "Now you're a Word Feelings Detective too! Ready to practice what you've learned?"
    }
  ];

  const currentLessonData = lessons[currentLesson];
  const progress = ((currentLesson + 1) / lessons.length) * 100;

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setShowExample(false);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      setShowExample(false);
    }
  };

  const exampleResult = analyzeSentiment(currentLessonData.example);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Learn About Word Feelings 📚
          </h1>
          <p className="text-xl text-muted-foreground">
            Let Senti teach you how to be a Word Feelings Detective!
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="card-lab mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-foreground">Your Learning Progress</h3>
            <span className="text-sm font-medium text-primary">
              Lesson {currentLesson + 1} of {lessons.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {Math.round(progress)}% Complete - Keep going! 🌟
          </p>
        </Card>

        {/* Main Lesson Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-lab">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {currentLessonData.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {currentLessonData.content}
              </p>

              {/* Example Section */}
              <div className="bg-muted/30 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foreground">📝 Example:</h3>
                  <Button
                    onClick={() => setShowExample(!showExample)}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {showExample ? 'Hide Analysis' : 'Analyze This!'} 🔍
                  </Button>
                </div>
                
                <div className="bg-white rounded-xl p-4 mb-4 border-2 border-dashed border-primary/30">
                  <p className="text-lg font-medium text-center text-foreground">
                    "{currentLessonData.example}"
                  </p>
                </div>

                {showExample && (
                  <div className="animate-fade-in">
                    <SentimentDisplay result={exampleResult} showDetails={true} />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  onClick={prevLesson}
                  disabled={currentLesson === 0}
                  variant="outline"
                  className="rounded-full"
                >
                  ← Previous
                </Button>

                <div className="flex gap-2">
                  {lessons.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentLesson(index);
                        setShowExample(false);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentLesson 
                          ? 'bg-primary scale-125' 
                          : index < currentLesson
                          ? 'bg-positive'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {currentLesson < lessons.length - 1 ? (
                  <Button
                    onClick={nextLesson}
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    Next →
                  </Button>
                ) : (
                  <Link to="/playground">
                    <Button className="btn-magic">
                      Try Playground! 🎮
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Senti Sidebar */}
          <div className="space-y-6">
            <Card className="card-lab text-center">
              <SentiRobot
                mood={currentLessonData.robotMood}
                message={currentLessonData.robotMessage}
                size="large"
                animate={true}
              />
            </Card>

            {/* Quick Facts */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">
                🧠 Quick Facts:
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-positive">😊</span>
                  <p className="text-muted-foreground">
                    Positive words make sentences feel happy and upbeat!
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-negative">😢</span>
                  <p className="text-muted-foreground">
                    Negative words express sadness, anger, or disappointment.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-neutral">😐</span>
                  <p className="text-muted-foreground">
                    Neutral words don't show strong emotions either way.
                  </p>
                </div>
              </div>
            </Card>

            {/* Learning Path */}
            <Card className="card-lab">
              <h3 className="text-lg font-bold mb-4 text-foreground">
                🎯 Your Learning Path:
              </h3>
              <div className="space-y-2 text-sm">
                {lessons.map((lesson, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      index === currentLesson 
                        ? 'bg-primary/10 text-primary font-medium'
                        : index < currentLesson
                        ? 'text-positive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span>
                      {index < currentLesson ? '✅' : index === currentLesson ? '🔄' : '⏳'}
                    </span>
                    <span className="text-xs">
                      {lesson.title.replace(/[📚🤔😊😢😐🔍🌟]/g, '').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Completion Celebration */}
        {currentLesson === lessons.length - 1 && (
          <Card className="card-lab mt-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Congratulations, Word Detective! 
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              You've learned the basics of sentiment analysis! Ready to practice your new skills?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/playground">
                <Button className="btn-magic">
                  Practice in Playground 🎮
                </Button>
              </Link>
              <Link to="/exercises">
                <Button variant="outline" className="rounded-full">
                  Try Fun Exercises 🏆
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
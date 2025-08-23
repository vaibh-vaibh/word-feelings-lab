import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SentiRobot from '@/components/SentiRobot';
import heroLabImage from '@/assets/hero-lab.jpg';

export default function Home() {
  const [currentStoryStep, setCurrentStoryStep] = useState(0);

  const storySteps = [
    {
      title: "Welcome to the Word Feelings Laboratory! 🧪",
      message: "Hi there! I'm Senti, your friendly robot scientist! Want to discover something AMAZING about words?",
      mood: 'happy' as const
    },
    {
      title: "Words Have Feelings Too! 💭",
      message: "Did you know that words can be happy, sad, or just okay? I can teach you how to figure out what words are feeling!",
      mood: 'thinking' as const
    },
    {
      title: "Let's Explore Together! 🌟",
      message: "Come on! Let's start our magical journey into the world of word feelings. Are you ready to become a Word Feelings Detective?",
      mood: 'happy' as const
    }
  ];

  const currentStep = storySteps[currentStoryStep];

  const nextStep = () => {
    if (currentStoryStep < storySteps.length - 1) {
      setCurrentStoryStep(currentStoryStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStoryStep > 0) {
      setCurrentStoryStep(currentStoryStep - 1);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroLabImage})` }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-positive bg-clip-text text-transparent">
              Word Feelings Lab
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium">
              Discover the magical world where words have feelings! 🎭✨
            </p>

            {/* Story Section */}
            <div className="card-lab max-w-2xl mx-auto mb-12">
              <div className="mb-8">
                <SentiRobot 
                  mood={currentStep.mood}
                  message={currentStep.message}
                  size="large"
                  animate={true}
                />
              </div>
              
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {currentStep.title}
              </h2>

              {/* Story Navigation */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStoryStep === 0}
                  className="rounded-full"
                >
                  ← Back
                </Button>
                
                <div className="flex gap-2">
                  {storySteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentStoryStep 
                          ? 'bg-primary scale-125' 
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={nextStep}
                  disabled={currentStoryStep === storySteps.length - 1}
                  className="rounded-full"
                >
                  Next →
                </Button>
              </div>

              {/* Action Buttons */}
              {currentStoryStep === storySteps.length - 1 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/learn">
                    <Button className="btn-magic text-lg px-8 py-4">
                      Start Learning! 🚀
                    </Button>
                  </Link>
                  <Link to="/playground">
                    <Button variant="outline" className="rounded-full px-8 py-4 text-lg">
                      Jump to Playground 🎮
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            What Will You Discover? 🔍
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-lab text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Learn the Basics</h3>
              <p className="text-muted-foreground mb-4">
                Discover how words can be happy, sad, or neutral with fun examples!
              </p>
              <Link to="/learn">
                <Button variant="outline" className="rounded-full">
                  Start Learning
                </Button>
              </Link>
            </div>

            <div className="card-lab text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Play & Practice</h3>
              <p className="text-muted-foreground mb-4">
                Type your own words and see Senti analyze their feelings instantly!
              </p>
              <Link to="/playground">
                <Button variant="outline" className="rounded-full">
                  Try Playground
                </Button>
              </Link>
            </div>

            <div className="card-lab text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Test Your Skills</h3>
              <p className="text-muted-foreground mb-4">
                Take fun quizzes and exercises to become a Word Feelings Expert!
              </p>
              <Link to="/exercises">
                <Button variant="outline" className="rounded-full">
                  Try Exercises
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="card-lab max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              🤔 Did You Know?
            </h2>
            <div className="space-y-4 text-left">
              <p className="text-muted-foreground">
                <strong className="text-foreground">🧠 Your brain</strong> can understand the feelings in words in just milliseconds!
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">📱 Every day</strong> computers like me analyze billions of words to understand human emotions!
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">🌍 Around the world</strong> people use sentiment analysis to make social media, customer service, and even movie reviews better!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { HelpCircle } from "lucide-react";

interface HeaderProps {
  currentRound: number;
  maxRounds: number;
  level: string;
}

const Header = ({ currentRound, maxRounds, level }: HeaderProps) => {
  const [helpOpen, setHelpOpen] = useState(false);
  
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold">Bias Buster</h1>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm">Round:</span>
            <span className="font-bold">{currentRound}/{maxRounds}</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm">Level:</span>
            <span className="font-bold">{level}</span>
          </div>
          <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white text-primary hover:bg-white/90 px-3 py-1 h-auto rounded-full">
                <HelpCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Help</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Bias Buster: How To Play</SheetTitle>
                <SheetDescription>
                  Welcome to the HR Interview Simulator
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Game Objective</h3>
                  <p className="text-sm text-muted-foreground">
                    Build the most effective and diverse team by making hiring decisions that consider merit while avoiding unconscious bias.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">How To Play</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-4">
                    <li>Review each candidate's profile thoroughly using the tabs (Education, Experience, Skills, References)</li>
                    <li>Look for both red flags and gold stars that provide additional context</li>
                    <li>Ask follow-up questions to gather more information</li>
                    <li>Select the candidate you believe is best for the role</li>
                    <li>Reflect on your decision to understand what influenced your choice</li>
                    <li>Every 3 rounds, review your team dashboard to see the impact of your decisions</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Tips For Success</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                    <li>Consider all aspects of each candidate, not just their education or experience</li>
                    <li>Pay attention to the educational insights throughout the game</li>
                    <li>Try to build a diverse team with complementary skills</li>
                    <li>Be mindful of your own biases and how they might affect your decisions</li>
                  </ul>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Briefcase, Award, FileText } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Bias Buster
          </h1>
          <p className="text-xl font-heading text-muted-foreground max-w-3xl mx-auto">
            An interactive HR interview simulator that helps you understand how unconscious bias affects hiring decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                What is Bias Buster?
              </CardTitle>
              <CardDescription>
                Educational simulation for HR professionals and recruiters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Bias Buster is an immersive educational game that simulates the recruitment process, 
                helping you identify and overcome unconscious biases in hiring decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  <span>Review diverse candidate profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span>Make hiring decisions across multiple rounds</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Receive real-time feedback and analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Earn badges and progress through levels</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/game">
                <Button className="w-full" size="lg">
                  Start Simulation
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                Why It Matters
              </CardTitle>
              <CardDescription>
                Impact of bias in the workplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Diverse teams outperform homogeneous teams by 35%</p>
                  <p className="text-sm text-muted-foreground">
                    On average in problem-solving tasks and innovation metrics
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Unconscious bias costs businesses</p>
                  <p className="text-sm text-muted-foreground">
                    Approximately $64 billion annually in employee turnover
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Companies in the top quartile for gender diversity</p>
                  <p className="text-sm text-muted-foreground">
                    Are 25% more likely to have above-average profitability
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Learn to identify and overcome bias in your hiring process to build stronger, more diverse teams.
              </p>
            </CardFooter>
          </Card>
        </div>


      </div>
    </div>
  );
};

export default Home;

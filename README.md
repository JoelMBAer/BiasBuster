# BiasBuster: HR Interview Simulator

![BiasBuster Banner](https://example.com/images/biasbuster-banner.png)

An interactive educational simulation designed to help HR professionals identify and mitigate unconscious bias in hiring decisions.

## 🌟 Project Overview

The Bias Buster HR Interview Simulator is a gamified learning platform that uses realistic candidate profiles and AI-powered analysis to reveal potential unconscious biases in hiring practices. Through interactive rounds of candidate selection and reflection, users develop awareness of their own decision patterns in a safe, educational environment.

## 🚀 Features

### Core Experience
- **Multi-round Hiring Simulation**: Progress through 5+ rounds of hiring different positions
- **Diverse Candidate Pool**: Dynamically generated candidates with varying demographics, education, and experience
- **Reflection System**: Self-report on what factors influenced each hiring decision
- **Educational Popups**: Learn about specific bias types after each selection

### Analytics & Insights
- **Decision Consistency Heatmap**: Visualize your selection patterns across different factors
- **Bias Pattern Detection**: AI-powered analysis of potential unconscious biases in selections
- **What-If Simulator**: Explore how different hiring choices would affect team composition
- **Team Demographics Dashboard**: Monitor diversity metrics as your virtual team grows

### Educational Tools
- **Bias Flashcards**: Quick facts and strategies for different types of hiring biases
- **Research-Based Content**: All educational content based on current HR and DEI research
- **Personalized Recommendations**: Targeted suggestions based on your specific selection patterns

## 💻 Technology Stack

- **Frontend**: React + TypeScript with Shadcn UI components
- **Backend**: Express.js API server
- **State Management**: React Context API + TanStack Query
- **Styling**: Tailwind CSS with custom theming
- **AI Integration**: OpenAI API for candidate generation and bias analysis
- **Data Source**: BLS API for realistic employment data

## 📋 Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/biasbuster.git

# Navigate to project directory
cd biasbuster

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔑 API Keys

This project requires two API keys:
- `OPENAI_API_KEY`: For candidate generation and bias analysis
- `BLS_API_KEY`: For employment statistics (free from Bureau of Labor Statistics)

Create a `.env` file in the root directory with these values:
```
OPENAI_API_KEY=your_openai_key_here
BLS_API_KEY=your_bls_key_here
```

## 🧠 Educational Framework

BiasBuster is built on a comprehensive bias awareness framework:

1. **Exposure**: Encounter realistic scenarios that may trigger bias
2. **Decision-Making**: Make hiring choices based on candidate information
3. **Self-Reflection**: Identify what factors influenced each decision
4. **Pattern Recognition**: Visualize consistent patterns in decision-making
5. **Targeted Education**: Learn about specific bias types relevant to your patterns
6. **Alternative Exploration**: Test how different choices affect outcomes
7. **Strategy Development**: Learn practical techniques to mitigate bias

## 📈 Future Development

- Database persistence for longer-term tracking
- Multiplayer mode for team training
- Customizable industry-specific scenarios
- Integration with real-world ATS (Applicant Tracking Systems)
- Additional bias types and mitigation strategies

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

Questions or feedback? Reach out to us at contact@biasbusterapp.com.

---

*BiasBuster is an educational tool designed to help individuals recognize and address unconscious bias. It is not intended to replace comprehensive diversity training or professional HR guidance.*
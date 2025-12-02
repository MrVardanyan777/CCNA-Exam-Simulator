# CCNA Practice & Exam Simulator

A comprehensive React-based study application designed to help you prepare for the CCNA 200-301 exam through interactive practice sessions and realistic exam simulations.

## 🌐 Check the project in Live 
- [https://ccna-exam-simulator.vercel.app/](https://ccna-exam-simulator.vercel.app/))

## 🎯 Features

### Practice Mode
- **Category-based Learning**: Study questions organized by CCNA exam topics
- **Interactive Learning**: Show/hide answers with detailed explanations
- **Smart Navigation**: Navigate linearly or jump to specific questions
- **Visual Feedback**: Color-coded answer highlighting (correct/incorrect)
- **Progress Tracking**: Real-time progress bar and statistics

### Exam Simulation Mode
- **Realistic Exam Environment**: Mimics actual CCNA exam conditions
- **Customizable Settings**: Configure number of questions and time limits
- **Timed Assessment**: Countdown timer with auto-submit functionality
- **Linear Flow**: One-way navigation to simulate real exam constraints
- **Comprehensive Review**: Detailed score report with explanations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [https://github.com/yourusername/ccna-practice-exam-simulator.git](https://github.com/MrVardanyan777/CCNA-Exam-Simulator)
cd ccna-practice-exam-simulator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── UI/              # Reusable UI components (Buttons, ProgressBar)
│   └── Layout/          # Layout components (Navbar, Page wrappers)
├── features/
│   ├── practice/
│   │   ├── components/  # PracticeQuestion.jsx
│   │   ├── pages/       # PracticeHome.jsx, LearnMode.jsx
│   │   └── hooks/       # usePracticeEngine.js
│   └── exam/
│       ├── components/  # ExamQuestion.jsx
│       ├── pages/       # ExamSetup.jsx, ExamMode.jsx, ExamReview.jsx
│       └── hooks/       # useExamEngine.js
├── context/
│   └── AppContext.jsx   # Global state management
├── router/
│   └── AppRouter.jsx    # Application routing
├── utils/
│   ├── shuffle.js
│   ├── filterByCategory.js
│   ├── selectRandom.js
│   └── validateAnswer.js
├── data/
│   └── questions.js     # Question bank
└── assets/
    └── images/          # Question images and diagrams
```

## 📚 Question Structure

Each question in the `questions.js` file follows this structure:

```javascript
{
  id: 291,
  question: "Which device performs stateful inspection of traffic?",
  options: { 
    A: "firewall", 
    B: "switch", 
    C: "access point", 
    D: "wireless controller" 
  },
  correctAnswer: ["A"],
  explanation: "Firewalls perform stateful inspection...",
  category: "Security Fundamentals",
  type: "multiple-choice", // multiple-choice, drag-drop, simple
  difficulty: "easy",
  hasImage: false,
  imagePath: "",
  pairs: [] // for drag-drop or matching questions
}
```

## 🗺️ Routes

- `/` - Home screen with mode selection
- `/practice` - Category selection for practice mode
- `/practice/:category` - Learn mode with questions
- `/exam` - Exam setup and configuration
- `/exam/start` - Active exam simulation
- `/exam/review` - Post-exam review with explanations
- `/exam/result` - Exam Result (final) page

## 🎨 UI Guidelines

- **Responsive Design**: Optimized for desktop and mobile devices
- **Tailwind CSS**: Utility-first styling approach
- **Lucide Icons**: Consistent iconography throughout the app
- **Color Coding**: 
  - Green for correct answers
  - Red for incorrect answers
  - Blue for navigation and actions

## 📝 Adding Questions

To add new questions to the question bank:

1. Open `src/data/questions.js`
2. Add a new question object following the structure above
3. Ensure the `id` is unique
4. Assign appropriate `category`, `difficulty`, and `type`
5. For questions with images, set `hasImage: true` and provide `imagePath`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Cisco for the CCNA 200-301 exam curriculum
- The React and Tailwind CSS communities
- All contributors who help improve this study tool

## 📧 Contact

Your Name - vache.vardanyan.vach@gmail.com

Project Link: [https://github.com/yourusername/ccna-practice-exam-simulator](https://github.com/yourusername/ccna-practice-exam-simulator)

---

**Note**: This is a personal study tool and is not affiliated with or endorsed by Cisco Systems, Inc. CCNA is a registered trademark of Cisco Systems, Inc.
